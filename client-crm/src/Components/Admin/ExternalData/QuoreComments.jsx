import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../../config/api';
import { LoadingSpinner, TableHeader, CommentRow, ViewCommentPopup, DeleteConfirmationPopup } from '../common/CommentComponents';
import { Header } from '../common/Header';
import { Sidebar,useSidebar } from '../common/sidebar';
import { cn } from "../../../utils/cn";
import { useTheme } from '../../../hooks/use-theme';
import Footer from '../common/Footer';

const QuoreComments = ({collapsed}) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [viewPopupOpen, setViewPopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
              toast.error("Please log in to view comments", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: theme === 'dark' ? 'dark' : 'light',
                            style: { fontSize: '1.2rem' }, 
                          });
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/external/qb2b/contact`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
            toast.error("Failed to fetch comments", {
                          position: "top-right",
                          autoClose: 5000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: theme === 'dark' ? 'dark' : 'light',
                          style: { fontSize: '1.2rem' }, 
                        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <Header 
               onToggleSidebar={toggleSidebar} 
           />
            <Sidebar 
                     isOpen={isSidebarOpen} 
                     onClose={closeSidebar}
             >
          <div className={cn(
        "transition-[margin] duration-300 ease-in-out",
        collapsed ? "md:ml-[70px]" : "md:ml-[0px]"
      )}>
    <div className="min-h-screen bg-gray-50  dark:bg-slate-800 p-20">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 relative w-full">
          <div className="md:hidden sm:hidden w-full flex flex-col items-center space-y-4 mb-4">
            <div className="flex justify-center w-full items-center">
              <h1 className="text-base font-bold text-gray-800 dark:text-gray-400">
                Quore B2B 
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex md:flex w-full justify-between items-center">
            <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-3xl md:text-lg lg:text-3xl font-bold text-gray-800 dark:text-gray-400 mr-2 mb-10">
                Quore B2B Comments
              </h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <main>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-lg dark:border dark:border-gray-700 shadow p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y dark:divide-gray-800 divide-gray-200">
                <thead className="bg-gray-50 dark:bg-slate-800">
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Comment</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200">
                  {comments.map(comment => (
                    <CommentRow 
                      key={comment.id} 
                      comment={comment} 
                      onView={() => {
                        setSelectedComment(comment);
                        setViewPopupOpen(true);
                      }}
                      onDelete={() => {
                        setCommentToDelete(comment);
                        setDeletePopupOpen(true);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {viewPopupOpen && selectedComment && (
        <ViewCommentPopup
          comment={selectedComment}
          onClose={() => setViewPopupOpen(false)}
          activeTab="quore"
        />
      )}

      {deletePopupOpen && (
        <DeleteConfirmationPopup
          onClose={() => setDeletePopupOpen(false)}
        />
      )}
    </div>
    </div>
    </Sidebar>
    <Footer/>
    </>
  );
};

export default QuoreComments;