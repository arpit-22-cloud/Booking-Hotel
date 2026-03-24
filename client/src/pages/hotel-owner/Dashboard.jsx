import React, { useEffect, useState } from "react";
import Title from "../../components/Title.jsx";
import { useAppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, getToken, user , currency } = useAppContext();
  
  const [dashBoardData, setdashBoardData] = useState({
    bookings:[],
    totalBookings:0,
    totalRevenue:0,
  });

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/bookings/hotel/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setdashBoardData(data.dashboardData);
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  return (
    <div>
      <Title
        title="Dashboard"
        align="left"
        subtitle="Monitor your room listingd, track bookings and analyxe revenue-all in one place. Stay update with real-time insights to ensure smooth operations."
        font="outfit"
      />
      <div className="flex gap-4 my-8">
        {/* total booking  */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-neutral-400 text-base">
              {dashBoardData.totalBookings}
            </p>
          </div>
        </div>
        {/* totral-revenu  */}
        <div className="bg-primary/3 border border-primary/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt=""
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-neutral-400 text-base">{currency}
              {dashBoardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>
      {/* recent booking  */}
      <h2 className="text-xl text-blue-950/70 font-medium mb-5">
        Recent Booking
      </h2>
      <div className="w-full max-w-3xl tet-left border border-gray-300 rouned-lg max-h-80 overflow-y-scroll">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">User Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium max-sm:hidden">
                Room Name
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Total Amount
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {dashBoardData.bookings.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  {item.user.username}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden text-center">
                  {item.room.roomType}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t border-gray-300 text-center">
                  $ {item.totalPrice}
                </td>
                <td className="py-3 px-4  text-center justify-center flex border-t border-gray-300 ">
                  <button
                    className={`py-1 px-3 text-center text-xs rounded-full max-auto ${item.isPaid ? "bg-green-200 text-green-600" : "bg-amber-200 text-yellow-600"}`}
                  >
                    {item.isPaid ? "completed" : "pending"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
