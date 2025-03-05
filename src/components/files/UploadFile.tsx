export const handleUploadFile = async (
  acceptedFiles: File[],
  functionName: string,
  setPercent: React.Dispatch<React.SetStateAction<number>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setFormNotification: React.Dispatch<React.SetStateAction<any>>,
  deleteFiles: Function,
  postFiles: Function,
  setListPicture: React.Dispatch<React.SetStateAction<any>>,
  listPicture: any
) => {
  if (acceptedFiles.length === 0) return;

  const file = acceptedFiles[0];
  const startTime = Date.now();
  const estimatedTime = 5000;

  // Kiểm tra định dạng file
  if (file.type !== "application/pdf") {
    setFormNotification({
      isOpen: true,
      status: "error",
      message: "Định dạng tệp tin không hợp lệ!",
      description: `Định dạng tệp tin ${file.name} là ${file.type}. Vui lòng chọn định dạng .pdf`,
    });
    return;
  }

  // Kiểm tra dung lượng file
  if (file.size > 10 * 1024 * 1024) {
    setFormNotification({
      isOpen: true,
      status: "error",
      message: "Dung lượng tệp tin quá lớn!",
      description: `Dung lượng tệp tin ${file.name} là ${(
        file.size /
        (1024 * 1024)
      ).toFixed(2)} MB, vượt quá dung lượng tối đa 10 MB!`,
    });
    return;
  }

  setIsLoading(true);
  setPercent(0);

  const formData = new FormData();
  formData.append("FunctionName", functionName);
  formData.append("file", file);

  try {
    // Xóa tệp tin cũ nếu có
    if (listPicture?.path) {
      await deleteFiles(
        listPicture.path.replace("https://api-annual.uef.edu.vn/", "")
      );
    }

    // Gửi tệp lên server
    const results = await postFiles(formData);
    if (!results) throw new Error("Không nhận được phản hồi từ server!");

    setListPicture(results);

    // Tính toán thời gian còn lại
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(estimatedTime - elapsedTime, 500); // Không để thời gian quá ngắn
    let currentPercent = 0;

    // Cập nhật phần trăm tải lên
    const intervalId = setInterval(() => {
      currentPercent += 1;
      setPercent((prev) => Math.min(prev + 1, 100));

      if (currentPercent >= 100) {
        clearInterval(intervalId);
        setFormNotification({
          isOpen: true,
          status: "success",
          message: "Thông báo",
          description: `Tải lên tệp tin: ${results.name} thành công!`,
        });
        setIsLoading(false);
      }
    }, remainingTime / 100);
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
