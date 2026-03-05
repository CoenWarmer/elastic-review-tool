import { postMessage } from '../vscode';

interface Props {
  activeTab: 'queue' | 'reviewing';
  queueLabel: string;
  reviewingLabel: string;
}

export function TabBar({ activeTab, queueLabel, reviewingLabel }: Props) {
  const switchTab = (tab: 'queue' | 'reviewing') => {
    postMessage({ type: 'switchTab', tab });
  };

  return (
    <div className="tab-bar">
      <button
        className={`tab${activeTab === 'queue' ? ' active' : ''}`}
        onClick={() => switchTab('queue')}
      >
        {queueLabel}
      </button>
      <button
        className={`tab${activeTab === 'reviewing' ? ' active' : ''}`}
        onClick={() => switchTab('reviewing')}
      >
        {reviewingLabel}
      </button>
    </div>
  );
}
