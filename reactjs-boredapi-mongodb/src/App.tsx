import React, { useState, ChangeEvent } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:3010/graphql',
  cache: new InMemoryCache(),
});

const GET_ACTIVITIES = gql`
  query GetActivities($type: String) {
    activities(type: $type) {
      _id
      activity
      type
    }
  }
`;

interface Activity {
  _id: string;
  activity: string;
  type: string;
}

const ActivitiesList: React.FC<{ type?: string }> = ({ type }) => {
  const { loading, error, data } = useQuery(GET_ACTIVITIES, {
    variables: { type },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ul>
      {data.activities.map((activity: Activity) => (
        <li key={activity._id}>
          {activity.activity} ({activity.type})
        </li>
      ))}
    </ul>
  );
};

const App: React.FC = () => {
  const [type, setType] = useState<string>('');

  const handleTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };

  return (
    <ApolloProvider client={client}>
      <div>
        <h1>Activities</h1>
        <input type="text" placeholder="Filter by type" value={type} onChange={handleTypeChange} />
        <ActivitiesList type={type} />
      </div>
    </ApolloProvider>
  );
};

export default App;
