import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/user/Home";
import NotFound from "./others/NotFound";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import UserLayout from "./layouts/UserLayout";
import OtpVerification from "./pages/global/OtpVerification.tsx";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { IUserState } from "./interfaces/user.ts";
import { AppDispatch, RootState } from "./redux/store.ts";
import OrganizerLandingPage from "./pages/organizer/OrganizerLandingPage";
import OrganizerRegister from "./pages/organizer/OrganizerRegister.tsx";
import LoginOrganizerPage from "./pages/organizer/LoginOrganizerPage.tsx";
import OrganizerLayout from "./layouts/OrganizerLayout.tsx";
import OrganizerDashboard from "./pages/organizer/dashboard/OrganizerDashBoard.tsx";
import OrganizerEventManagement from "./pages/organizer/dashboard/OrganizerEventManagement.tsx";
import OrganizerBlogManagement from "./pages/organizer/dashboard/OrganizerBlogManagement.tsx";
import OrganizerReportsAndGraphManagement from "./pages/organizer/dashboard/OrganizerReportsAndGraphManagement.tsx";
import OrganizerUserReportManagement from "./pages/organizer/dashboard/OrganizerUserReportManagement.tsx";
import OrganizerPayoutManagement from "./pages/organizer/dashboard/OrganizerPayoutManagement.tsx";
import OrganizerSettings from "./pages/organizer/dashboard/OrganizerSettings.tsx";
import OrganizerProfile from "./pages/organizer/dashboard/OrganizerProfile.tsx";
import OrganizerProtectedRoute from "./security/OrganizerProtectedRoute.tsx";
import UnauthenticatedOrganizerPages from "./security/UnauthenticatedOrganizerPages.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminProtectedRoute from "./security/AdminProtectedRoutes.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminUserManagement from "./pages/admin/AdminUserManagement.tsx";
import VerifyOrganizer from "./pages/organizer/VerifyOrganizer.tsx";
import AdminOrganizerManagement from "./pages/admin/AdminOrganizerManagement.tsx";
import AdminOrganizerDetailsPage from "./pages/admin/AdminOrganizerDetailsPage.tsx";
import CreateOnlineEvent from "./pages/organizer/dashboard/event/CreateOnlineEvent.tsx";
import CreateOfflineEvent from "./pages/organizer/dashboard/event/CreateOfflineEvent.tsx";
import AdminEventManagement from "./pages/admin/AdminEventManagement.tsx";
import UserProfileLayout from "./layouts/UserProfileLayout.tsx";
import EventsPanel from "./components/user/EventsPanel.tsx";
import AboutPanel from "./components/user/AboutPanel.tsx";
import SettingsPanel from "./components/user/SettingsPanel.tsx";
import OrdersPanel from "./components/user/OrdersPanel.tsx";
import ForgotPassword from "./pages/user/ForgotPassword.tsx";
import { OnlineEventProvider } from "./context/OnlineEventContext.tsx";
import OrganizerManageEvent from "./pages/organizer/dashboard/event/OrganizerManageEvent.tsx";
import AdminProfile from "./pages/admin/AdminProfile.tsx";
import { useEffect } from "react";
import { isUserActive } from "./redux/action/userActions.ts";
import { userSlice } from "./redux/reducers/userSlice.ts";
import EventAdminOverview from "./pages/admin/EventAdminOverview.tsx";
import EventPreview from "./pages/user/EventPreview.tsx";
import OrganizerListing from "./pages/user/OrganizerListing.tsx";
import EventListing from "./pages/user/EventListing.tsx";
import EventRegister from "./pages/user/EventRegister.tsx";
import EventConfirmation from "./components/user/EventConfirmation.tsx";
import EventTickets from "./pages/user/EventTickets.tsx";
import BookingStatusHandler from "./components/user/BookingStatusHandler.tsx";
import OrganizerProfilePage from "./pages/user/OrganizerProfilePage.tsx";
import UserCalender from "./components/user/UserCalender.tsx";
import LiveRoom from "./pages/user/LiveRoom.tsx";
import OrganizerLiveEvents from "./pages/organizer/dashboard/OrganizerLiveEvents.tsx";
import UserLiveEvent from "./components/user/UserLiveEvent.tsx";

interface AnonymousRouteProps {
  children: JSX.Element;
}

const AnonymousRoute: React.FC<AnonymousRouteProps> = ({ children }) => {
  const { isLogged } = useSelector(
    (state: RootState) => state.user as IUserState
  );

  if (isLogged) {
    return <Navigate to="/" replace />;
  }

  return children;
};

interface VerificationRouteProps {
  children: JSX.Element;
}

const VerificationRoute: React.FC<VerificationRouteProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.user as IUserState);

  if (!user || user.verificationStatus !== "PENDING") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const email = useSelector((state: RootState) => state.user.user?.email);

  const checkUserActive = async () => {
    if (email) {
      try {
        const response = await dispatch(isUserActive({ email })).unwrap();
        if (response) {
          return;
        }
        toast.error(
          " Your account has been blocked. Please contact support for further assistance."
        );
        dispatch(userSlice.actions.setUserInactive());
      } catch (error) {
        console.error("Failed to check if user is active:", error);
      }
    }
  };

  useEffect(() => {
    checkUserActive();
  }, []);

  return (
    <>
      {/* <BlockUserComponent /> */}
      <Routes>
        <Route
          path="/login"
          element={
            <AnonymousRoute>
              <Login />
            </AnonymousRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AnonymousRoute>
              <ForgotPassword />
            </AnonymousRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AnonymousRoute>
              <Register />
            </AnonymousRoute>
          }
        />
        <Route
          path="/verify"
          element={
            <VerificationRoute>
              <OtpVerification />
            </VerificationRoute>
          }
        />

        <Route path="/" element={<UserLayout />}>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/explore"
            element={
              <EventListing />
            }
          />

          <Route
            path="/organizers"
            element={
              <OrganizerListing />
            }
          />

          <Route
            path="/host/profile/:id"
            element={
              <OrganizerProfilePage />
            }
          />


          <Route path="/event/:eventParams" element={<EventPreview />} />
          <Route path="/event/register/:eventParams" element={<EventRegister />} />
          <Route path="/event/tickets/:eventParams" element={<EventTickets />} />
          <Route path="/event/confirmation/:eventParams" element={<EventConfirmation />} />

          <Route
            path="/profile/*"
            element={
              <UserProfileLayout>
                <Routes>
                  <Route path="/" element={<EventsPanel />} />
                  <Route path="about" element={<AboutPanel />} />
                  <Route path="settings" element={<SettingsPanel />} />
                  <Route path="bookings" element={<OrdersPanel />} />
                  <Route path="calender" element={<UserCalender />} />
                </Routes>
              </UserProfileLayout>
            }
          />

          {/* Organizer Route without ProtectedRoute */}
          <Route
            path="/become-an-organizer"
            element={<OrganizerLandingPage />}
          />

          <Route
            path="/register-organizer"
            element={
              <UnauthenticatedOrganizerPages element={<OrganizerRegister />} />
            }
          />
          <Route
            path="/login-organizer"
            element={
              <UnauthenticatedOrganizerPages element={<LoginOrganizerPage />} />
            }
          />
        </Route>

        <Route path="live/:id" element={<UserLiveEvent />} />

        {/* Here is checking if the booking success or failed  */}
        <Route path="/event/booking/status/:eventParams?" element={<BookingStatusHandler />} />


        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route element={<OrganizerProtectedRoute />}>
            <Route path="dashboard" element={<OrganizerDashboard />} />
            // event management
            <Route
              path="event-management"
              element={<OrganizerEventManagement />}
            />
            <Route path="event/:id?" element={<OrganizerManageEvent />} />
            <Route
              path="online-event/*"
              element={
                <OnlineEventProvider>
                  <CreateOnlineEvent />
                </OnlineEventProvider>
              }
            />
            <Route
              path="offline-event/*"
              element={
                <OnlineEventProvider>
                  <CreateOfflineEvent />
                </OnlineEventProvider>
              }
            />
            <Route
              path="create-offline-event"
              element={<CreateOfflineEvent />}
            />
            <Route
              path="live"
              element={<OrganizerLiveEvents />}
            />
            <Route
              path="blog-management"
              element={<OrganizerBlogManagement />}
            />
            <Route
              path="reports-and-graph"
              element={<OrganizerReportsAndGraphManagement />}
            />
            <Route
              path="user-reports"
              element={<OrganizerUserReportManagement />}
            />
            <Route
              path="payout-management"
              element={<OrganizerPayoutManagement />}
            />
            <Route path="settings" element={<OrganizerSettings />} />
          </Route>
          <Route path="profile" element={<OrganizerProfile />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="user-management"
            element={
              <AdminProtectedRoute>
                <AdminUserManagement />
              </AdminProtectedRoute>
            }
          />
          // Organizer Management
          <Route
            path="organizer-management"
            element={
              <AdminProtectedRoute>
                <AdminOrganizerManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/organizerDetails/:organizerId"
            element={
              <AdminProtectedRoute>
                <AdminOrganizerDetailsPage />
              </AdminProtectedRoute>
            }
          />
          // Event Management
          <Route
            path="event-management"
            element={
              <AdminProtectedRoute>
                <AdminEventManagement />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="event/:id"
            element={
              <AdminProtectedRoute>
                <EventAdminOverview />
              </AdminProtectedRoute>
            }
          />
          // Admin Profile
          <Route
            path="profile"
            element={
              <AdminProtectedRoute>
                <AdminProfile />
              </AdminProtectedRoute>
            }
          />
        </Route>

        <Route path="/verifyOrganizer/:token" element={<VerifyOrganizer />} />
        
        <Route path="/viewer" element={<LiveRoom />} />

        <Route path="*" element={<NotFound />} />
        
        
      </Routes>




      <ToastContainer />
    </>
  );
};

export default App;
