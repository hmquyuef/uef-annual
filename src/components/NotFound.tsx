const NotFound = () => {
    return (
      <div className="flex flex-col justify-center items-center my-10">
        <img
          src="/error.svg"
          width={250}
          height={250}
          loading="lazy"
          alt="404"
          className="my-1"
        />
        <p className="text-2xl font-semibold text-red-500 mb-1">Truy cập bị từ chối</p>
        <p className="text-md font-semibold text-red-500">Bạn chưa được cấp quyền khai thác biểu mẫu.</p>
      </div>
    );
  };
  export default NotFound;
  