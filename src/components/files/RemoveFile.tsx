export const handleDeleteFile = async (
  listFile: any,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPercent: React.Dispatch<React.SetStateAction<number>>,
  setFormNotification: React.Dispatch<React.SetStateAction<any>>,
  deleteFiles: Function,
  setListFile: React.Dispatch<React.SetStateAction<any>>
) => {
  setIsLoading(true);

  if (listFile && listFile.path !== "") {
    await deleteFiles(
      listFile.path.replace("https://api-annual.uef.edu.vn/", "")
    );

    const intervalId = setInterval(() => {
      setPercent((prevPercent) => {
        const newPercent = prevPercent === 0 ? 100 : prevPercent - 1;
        if (newPercent === 0) {
          clearInterval(intervalId);
          setListFile({ type: "", path: "", name: "", size: 0 }); // Reset lại danh sách tệp
          setFormNotification({
            isOpen: true,
            status: "success",
            message: "Thông báo",
            description: `Đã xóa tệp tin: ${listFile.name} thành công!`,
          });
          setIsLoading(false);
          return 0;
        }
        return newPercent;
      });
    }, 10);
  } else {
    setFormNotification({
      isOpen: true,
      status: "error",
      message: "Không có file nào để xóa.",
      description: "Không có tệp tin nào được chọn để xóa.",
    });
  }
};

export const handleDeleteFileExcel = async (
  file: { path: string; name: string } | undefined,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPercent: React.Dispatch<React.SetStateAction<number>>,
  setFormNotification: React.Dispatch<React.SetStateAction<any>>,
  deleteFiles: Function,
  setFile?: React.Dispatch<React.SetStateAction<any>>,
  resetData?: React.Dispatch<React.SetStateAction<any>>
) => {
  if (!file || !file.path) {
    console.log("Không có file nào để xóa.");
    return;
  }

  setIsLoading(true);

  try {
    await deleteFiles(file.path.replace("https://api-annual.uef.edu.vn/", ""));

    const intervalId = setInterval(() => {
      setPercent((prevPercent) => {
        let newPercent = prevPercent === 0 ? 100 : prevPercent - 1;
        if (newPercent === 0) {
          clearInterval(intervalId);
          setFormNotification({
            isOpen: true,
            status: "success",
            message: "Thông báo",
            description: `Đã xóa tệp tin: ${file.name} thành công!`,
          });
          if (setFile) setFile(undefined);
          if (resetData) resetData([]); // Reset dữ liệu nếu có
          setIsLoading(false);
          return 0;
        }
        return newPercent;
      });
    }, 10);
  } catch (error) {
    setFormNotification({
      isOpen: true,
      status: "error",
      message: "Đã có lỗi xảy ra!",
      description: `${error}. Vui lòng thử lại!`,
    });
    setIsLoading(false);
  }
};
