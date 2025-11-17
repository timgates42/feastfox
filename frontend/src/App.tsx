import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeastFoxApp } from './components/FeastFoxApp';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <main className="dark text-foreground bg-background min-h-screen">
          <FeastFoxApp />
        </main>
      </NextUIProvider>
    </QueryClientProvider>
  );
}

export default App;
