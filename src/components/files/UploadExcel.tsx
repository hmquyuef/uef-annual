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
  if (acceptedFiles.length === 0) return;

  const file = acceptedFiles[0];
  const startTime = Date.now();
  const estimatedTime = 5000;

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

  const formData = new FormData();
  formData.append("file", file);

  try {
    // Xóa file cũ nếu có
    if (existingFile?.path) {
      await deleteFiles(
        existingFile.path.replace("https://api-annual.uef.edu.vn/", "")
      );
      setDataAfterUpload?.([]); // Reset dữ liệu nếu có
    }

    // Gửi file lên server
    const results = await uploadFunction(formData);
    if (!results) throw new Error("Không nhận được phản hồi từ server!");

    // Kiểm tra nếu có lỗi từ server
    if (results.totalError > 0) {
      throw new Error(results.messageError);
    }

    setUploadedFile?.(results.pathExcel);
    setDataAfterUpload?.(results.items);

    // Cập nhật progress bar
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(estimatedTime - elapsedTime, 500); // Giữ ít nhất 500ms
    let currentPercent = 0;
    const intervalTime = remainingTime / 100;

    const intervalId = setInterval(() => {
      currentPercent += 1;
      setPercent((prev) => Math.min(prev + 1, 100));

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
  } catch (error: any) {
    setFormNotification({
      isOpen: true,
      status: "error",
      message: "Đã có lỗi xảy ra!",
      description: error?.message || "Vui lòng thử lại!",
    });
    setIsLoading(false);
  }
};
