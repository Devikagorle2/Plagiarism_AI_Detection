import { Joyride } from 'react-joyride';

const Onboarding = ({ run, onFinish }) => {
  const steps = [
    {
      target: '.dashboard-summary',
      content: 'Here you see your total spending and remaining budget for the month.',
      disableBeacon: true,
    },
    {
      target: '.add-expense-fab',
      content: 'Tap the + button to quickly add a new expense.',
      disableBeacon: true,
    },
    {
      target: '.chart-card',
      content: 'Visualize your spending by category with this chart.',
      disableBeacon: true,
    },
    {
      target: '.transaction-list',
      content: 'View your recent expenses here. Swipe left to delete any transaction.',
      disableBeacon: true,
    },
  ];

  const handleCallback = (data) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      if (onFinish) onFinish();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#6366f1',
        },
      }}
    />
  );
};

export default Onboarding;
