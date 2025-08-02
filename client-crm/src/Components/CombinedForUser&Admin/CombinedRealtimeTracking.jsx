
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '../Admin/common/Header';
import { Sidebar,useSidebar } from '../Admin/common/sidebar';
import RealtimeTracking from '../Admin/Forms/RealtimeTracking';
import { UserHeader } from '../User/common/UserHeader';
import { UserSidebar ,useSidebarUser} from '../User/common/UserSidebar';
import { UserFooter } from '../User/common/UserFooter';
import Footer from '../Admin/common/Footer';

const CombinedRealtimeTracking = ({collapsed}) => {
const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
const { isSidebarOpenUser, toggleSidebarUser, closeSidebarUser } = useSidebarUser();
  return (
    <>
{localStorage.getItem('userType') === 'admin' && (
<>
 <Header onToggleSidebar={toggleSidebar} />
  <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} >
   <RealtimeTracking />
  </Sidebar>
  <Footer/>
  </>
)}
  
{localStorage.getItem('userType') === 'user' && (
  <>
    <UserHeader onToggleSidebar={toggleSidebarUser} />
  <UserSidebar isOpen={isSidebarOpenUser} onClose={closeSidebarUser} >
   <RealtimeTracking />
   </UserSidebar>
   <UserFooter/>
  </>
)}
   </>
  );
};


export default CombinedRealtimeTracking;
