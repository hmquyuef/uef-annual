export const handleFileUpload = async (
  acceptedFiles: File[],
  allowedType: string,
  maxSizeMB: number,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setPercent: React.Dispatch<React.SetStateAction<number>>,
  setFormNotification: React.Dispatch<React.SetStateAction<any>>,
  uploadFunction: (formData: FormData) => Promise<any>,
  deleteFiles: Function,
  existingFile?: { path: string },
  setUploadedFile?: React.Dispatch<React.SetStateAction<any>>,
  setDataAfterUpload?: React.Dispatch<React.SetStateAction<any>>
) => {
  const file = acceptedFiles[0];

  // Kiểm tra định dạng file
  if (file.type !== allowedType) {
    setFormNotification({
      isOpen: true,
      status: "error",
      message: "Định dạng tệp tin không hợp lệ!",
      description: `Định dạng tệp tin ${file.name} là ${file.type}. Vui lòng chọn định dạng .xlsx`,
    });
    return;
  }

  // Kiểm tra dung lượng file
  if (file.size / (1024 * 1024) > maxSizeMB) {
    setFormNotification({
      isOpen: true,
      status: "error",
      message: "Dung lượng tệp tin quá lớn!",
      description: `Dung lượng tệp tin ${file.name} là ${(
        file.size /
        (1024 * 1024)
      ).toFixed(2)} MB, vượt quá dung lượng tối đa ${maxSizeMB} MB!`,
    });
    return;
  }

  setIsLoading(true);
  setPercent(0);

  const startTime = Date.now();
  const estimatedTime = 5000; // Thời gian ước lượng hiển thị progress

  const formData = new FormData();
  formData.append("file", file);

  // Xóa file cũ nếu có
  if (existingFile?.path && existingFile.path !== "") {
    await deleteFiles(
      existingFile.path.replace("https://api-annual.uef.edu.vn/", "")
    );
    if (setDataAfterUpload) setDataAfterUpload([]); // Reset dữ liệu sau khi xóa
  }

  try {
    const results = await uploadFunction(formData);
    if (results && results.totalError === 0) {
      if (setUploadedFile) setUploadedFile(results.pathExcel);
      if (setDataAfterUpload) setDataAfterUpload(results.items);

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.min(estimatedTime, elapsedTime);
      let currentPercent = 0;
      const intervalTime = remainingTime / 100;
      const intervalId = setInterval(() => {
        currentPercent += 1;
        setPercent((prev) => (prev < 100 ? prev + 1 : 100));
        if (currentPercent >= 100) {
          clearInterval(intervalId);
          setFormNotification({
            isOpen: true,
            status: "success",
            message: "Thông báo",
            description: `Tải lên tệp tin: ${file.name} thành công!`,
          });
          setIsLoading(false);
        }
      }, intervalTime);
    } else {
      setFormNotification({
        isOpen: true,
        status: "error",
        message: "Đã có lỗi xảy ra!",
        description: `${results.messageError}`,
      });
      setIsLoading(false);
    }
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
