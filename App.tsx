import FeedContext from './src/contexts/FeedContexts';
import UserContext from './src/contexts/UserContexts';
import RootStackNavigation from './src/navigations/RootStackNavigation';


export default function App() {
  
  return (
    <UserContext>
      <FeedContext>
      <RootStackNavigation/>
      </FeedContext>
    </UserContext>
  );
}