import UserContext from './src/contexts/UserContexts';
import RootStackNavigation from './src/navigations/RootStackNavigation';


export default function App() {
  
  return (
    <UserContext>
      <RootStackNavigation/>
    </UserContext>
  );
}