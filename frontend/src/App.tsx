import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FeastFoxApp } from './components/FeastFoxApp';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        <main className="dark text-foreground bg-background min-h-screen">
          <FeastFoxApp />
        </main>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}

export default App;
