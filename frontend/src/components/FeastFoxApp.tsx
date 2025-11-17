import { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { getDinnerDecision } from '../services/api';
import { mockDinnerDecision } from '../services/mock';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export function FeastFoxApp() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dinnerDecision', refreshKey],
    queryFn: USE_MOCK ? mockDinnerDecision : getDinnerDecision,
  });

  const handleNewDecision = () => {
    setRefreshKey((prev) => prev + 1);
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🦊 FeastFox</h1>
        <p className="text-lg text-gray-400">The clever dinner decider app!</p>
        <Chip color={USE_MOCK ? 'warning' : 'success'} variant="flat" className="mt-2">
          {USE_MOCK ? '🎭 Mock Mode' : '🌐 Connected to API'}
        </Chip>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md font-semibold">What's for dinner?</p>
            <p className="text-small text-default-500">
              Let FeastFox decide your next meal!
            </p>
          </div>
        </CardHeader>
        <CardBody>
          {isLoading && (
            <div className="text-center py-8">
              <p className="text-lg">🤔 Thinking...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-lg text-danger">
                ❌ Oops! Something went wrong.
              </p>
              <p className="text-small text-default-500 mt-2">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          )}

          {data && !isLoading && (
            <div className="text-center py-8">
              <p className="text-3xl font-bold mb-4">{data.meal}</p>
              <p className="text-lg text-default-500 mb-2">{data.cuisine}</p>
              <p className="text-small text-default-400">{data.reason}</p>
            </div>
          )}
        </CardBody>
        <CardFooter className="flex justify-center">
          <Button
            color="primary"
            size="lg"
            onClick={handleNewDecision}
            isLoading={isLoading}
          >
            {isLoading ? 'Deciding...' : '🎲 Get New Suggestion'}
          </Button>
        </CardFooter>
      </Card>

      <div className="text-center text-small text-default-400">
        <p>Built with React, NextUI, and TanStack Query</p>
      </div>
    </div>
  );
}
