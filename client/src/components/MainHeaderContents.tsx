import Announcement from "./Announcement";
import Main_Drawer from "./Main_Drawer";
import Main_Header from "./Main_Header";
import '@/assets/styles/Main_Header.css';

export default function MainHeaderContents({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Main_Drawer />
      
      <div className="flex flex-1 mt-16"> {/* Add top margin for navigation bar */}
        <div className="flex-1">
         
          {children}
          <Announcement />
        </div>
      </div>
    </div>
  );
}