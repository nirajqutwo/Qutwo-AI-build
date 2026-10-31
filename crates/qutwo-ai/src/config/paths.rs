use std::ffi::OsString;
use std::path::PathBuf;

pub struct Paths;

impl Paths {
    fn get_dir(dir_type: DirType) -> PathBuf {
        let base = Self::workspace_root();
        match dir_type {
            DirType::Config => base.join("config"),
            DirType::Data => base.join("data"),
            DirType::State => base.join("state"),
            DirType::Plugins => base.join(".agents").join("plugins"),
            DirType::Agents => base.join(".agents").join("agents"),
            DirType::AgentsHome => base.join(".agents"),
        }
    }

    /// The portable workspace: `QUTWO_AI_PATH_ROOT` when set (the desktop shell sets it to
    /// its install folder), otherwise the folder containing the running executable.
    /// Nothing is ever resolved against the user profile, AppData or any OS store.
    pub fn workspace_root() -> PathBuf {
        if let Some(root) = Self::path_root() {
            return root;
        }
        std::env::current_exe()
            .ok()
            .and_then(|exe| exe.parent().map(PathBuf::from))
            .expect("qutwo-ai cannot determine its own install folder")
    }

    /// Replacement for the OS home directory: a folder inside the workspace.
    pub fn home_dir() -> PathBuf {
        Self::workspace_root().join("home")
    }

    pub fn try_home() -> Option<PathBuf> {
        Some(Self::home_dir())
    }

    /// Pin every OS location a process or its children could use for user data
    /// (home, AppData, XDG, temp) inside the workspace. Call once, first thing in `main`,
    /// before any thread is spawned.
    pub fn isolate_process_environment() {
        let root = Self::workspace_root();
        let home = root.join("home");
        let tmp = root.join("data").join("tmp");
        let roaming = home.join("AppData").join("Roaming");
        let local = home.join("AppData").join("Local");
        for dir in [&home, &tmp, &roaming, &local, &Self::config_dir()] {
            let _ = std::fs::create_dir_all(dir);
        }
        std::env::set_var("QUTWO_AI_PATH_ROOT", &root);
        for key in ["TEMP", "TMP", "TMPDIR"] {
            std::env::set_var(key, &tmp);
        }
        std::env::set_var("HOME", &home);
        std::env::set_var("USERPROFILE", &home);
        std::env::set_var("APPDATA", &roaming);
        std::env::set_var("LOCALAPPDATA", &local);
        std::env::set_var("XDG_CONFIG_HOME", home.join(".config"));
        std::env::set_var("XDG_DATA_HOME", home.join(".local").join("share"));
        std::env::set_var("XDG_CACHE_HOME", home.join(".cache"));
        std::env::set_var("XDG_STATE_HOME", home.join(".local").join("state"));
    }

    pub(crate) fn path_root() -> Option<PathBuf> {
        Self::validated_path_root(std::env::var_os("QUTWO_AI_PATH_ROOT"))
    }

    fn validated_path_root(value: Option<OsString>) -> Option<PathBuf> {
        value.map(PathBuf::from).filter(|path| path.is_absolute())
    }

    pub fn config_dir() -> PathBuf {
        Self::get_dir(DirType::Config)
    }

    pub fn data_dir() -> PathBuf {
        Self::get_dir(DirType::Data)
    }

    pub fn state_dir() -> PathBuf {
        Self::get_dir(DirType::State)
    }

    pub fn plugins_dir() -> PathBuf {
        Self::get_dir(DirType::Plugins)
    }

    pub fn agents_dir() -> PathBuf {
        Self::get_dir(DirType::Agents)
    }

    pub fn agents_home_dir() -> PathBuf {
        Self::get_dir(DirType::AgentsHome)
    }

    pub fn in_agents_home_dir(subpath: &str) -> PathBuf {
        Self::agents_home_dir().join(subpath)
    }

    pub fn in_state_dir(subpath: &str) -> PathBuf {
        Self::state_dir().join(subpath)
    }

    pub fn in_config_dir(subpath: &str) -> PathBuf {
        Self::config_dir().join(subpath)
    }

    pub fn in_data_dir(subpath: &str) -> PathBuf {
        Self::data_dir().join(subpath)
    }
}

enum DirType {
    Config,
    Data,
    State,
    Plugins,
    Agents,
    AgentsHome,
}

#[cfg(test)]
mod tests {
    use super::Paths;
    use std::ffi::OsString;

    #[test]
    fn path_root_requires_an_absolute_path() {
        assert_eq!(Paths::validated_path_root(None), None);
        assert_eq!(Paths::validated_path_root(Some(OsString::new())), None);
        assert_eq!(
            Paths::validated_path_root(Some(OsString::from("relative/root"))),
            None
        );

        let absolute = std::env::current_dir()
            .unwrap()
            .join("nonexistent-qutwo-ai-root");
        assert_eq!(
            Paths::validated_path_root(Some(absolute.clone().into_os_string())),
            Some(absolute)
        );
    }
}
