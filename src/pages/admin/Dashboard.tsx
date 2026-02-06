const Dashboard = () => {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Tổng quan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-blue-500">
            <div className="text-gray-500">Tổng sản phẩm</div>
            <div className="text-3xl font-bold mt-2">Đang tải...</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
            <div className="text-gray-500">Đơn hàng mới</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-500">
            <div className="text-gray-500">Liên hệ chưa đọc</div>
            <div className="text-3xl font-bold mt-2">0</div>
          </div>
        </div>
        <div className="mt-10 p-10 bg-white rounded-lg text-center text-gray-400 border border-dashed border-gray-300">
          Biểu đồ doanh thu sẽ hiển thị ở đây
        </div>
      </div>
    );
  };
  
  export default Dashboard;