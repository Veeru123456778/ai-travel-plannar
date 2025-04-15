export default function TabSwitcher({ activeTab, setActiveTab }) {
    return (
      <div className="flex gap-6 text-lg font-semibold">
        <button
          onClick={() => setActiveTab('your')}
          className={`pb-1 ${
            activeTab === 'your' ? 'border-b-2 border-primary' : 'text-base-content/60'
          }`}
        >
          Your Plans
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`pb-1 ${
            activeTab === 'community' ? 'border-b-2 border-primary' : 'text-base-content/60'
          }`}
        >
          Community Plans
        </button>
      </div>
    )
  }
  