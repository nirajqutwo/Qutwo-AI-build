pub use qutwo_ai_download_manager::*;

#[cfg(test)]
mod tests {
    #[cfg(feature = "local-inference")]
    #[test]
    fn local_inference_uses_same_download_manager() {
        let qutwo_ai_manager = crate::download_manager::get_download_manager() as *const _;
        let local_manager =
            crate::providers::local_inference::download_manager::get_download_manager() as *const _;

        assert_eq!(qutwo_ai_manager, local_manager);
    }
}
