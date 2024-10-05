"use client";

const Permission = () => {
  return (
    <div className="w-full h-screen min-w-[400px] bg-gray-100 flex justify-center items-center">
      <div className="w-1/4 min-w-[400px] bg-white rounded-xl shadow-lg mb-16 flex flex-col items-center py-10">
        <img src="/logoUEF.svg" width={250} alt="login" />
        <div className="flex flex-col gap-3 my-3">
          <hr className="mt-2" />
          <div className="py-4 text-center">
            <p className="text-red-500 font-semibold mb-2">
              Tài khoản chưa được phân quyền sử dụng hệ thống.
            </p>
            <p className="text-red-500 text-[14px]">
              Vui lòng liên hệ TT.QLNCTT để được hỗ trợ.
            </p>
          </div>
          <hr className="mb-2" />
        </div>
      </div>
    </div>
  );
};

export default Permission;
