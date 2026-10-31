import { useState } from 'react';
import { Button } from '../../ui/button';
import { FolderKey } from 'lucide-react';
import { QutwoAihintsModal } from './QutwoAihintsModal';
import { defineMessages, useIntl } from '../../../i18n';

const i18n = defineMessages({
  title: {
    id: 'qutwoaihintsSection.title',
    defaultMessage: 'Project Hints (.qutwoaihints)',
  },
  description: {
    id: 'qutwoaihintsSection.description',
    defaultMessage:
      "Configure your project's .qutwoaihints file to provide additional context to Qutwo-AI",
  },
  configure: {
    id: 'qutwoaihintsSection.configure',
    defaultMessage: 'Configure',
  },
});

export const QutwoAihintsSection = () => {
  const intl = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const directory = window.appConfig?.get('QUTWO_AI_WORKING_DIR') as string;

  return (
    <>
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex-1">
          <h3 className="text-text-primary">{intl.formatMessage(i18n.title)}</h3>
          <p className="text-xs text-text-secondary mt-[2px]">
            {intl.formatMessage(i18n.description)}
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <FolderKey size={16} />
          {intl.formatMessage(i18n.configure)}
        </Button>
      </div>
      {isModalOpen && (
        <QutwoAihintsModal directory={directory} setIsQutwoAihintsModalOpen={setIsModalOpen} />
      )}
    </>
  );
};
