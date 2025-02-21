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
  const startTime = Date.now();
  let estimatedTime = 5000;

  // Kiểm tra định dạng file
  if (acceptedFiles[0].type !== "application/pdf") {
    setFormNotification((prev: any) => ({
      ...prev,
      isOpen: true,
      status: "error",
      message: "Định dạng tệp tin không hợp lệ!",
      description: `Định dạng tệp tin ${acceptedFiles[0].name} là ${acceptedFiles[0].type}. Vui lòng chọn định dạng .pdf`,
    }));
    return;
  }

  // Kiểm tra dung lượng file
  if (acceptedFiles[0].size > 10 * 1024 * 1024) {
    setFormNotification((prev: any) => ({
      ...prev,
      isOpen: true,
      status: "error",
      message: "Dung lượng tệp tin quá lớn!",
      description: `Dung lượng tệp tin ${acceptedFiles[0].name} là ${(
        acceptedFiles[0].size /
        (1024 * 1024)
      ).toFixed(2)} MB, vượt quá dung lượng tối đa 10 MB!`,
    }));
    return;
  }

  if (acceptedFiles[0].size > 0) {
    setIsLoading(true);
    setPercent(0);
    const formData = new FormData();
    formData.append("FunctionName", functionName);
    formData.append("file", acceptedFiles[0]);

    if (listPicture && listPicture.path !== "") {
      await deleteFiles(
        listPicture.path.replace("https://api-annual.uef.edu.vn/", "")
      );
    }

    try {
      const results = await postFiles(formData);
      if (results) {
        setListPicture(results);
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.min(estimatedTime, elapsedTime);
        let currentPercent = 0;
        const intervalTime = remainingTime / 100; // Mỗi bước tăng ứng với thời gian
        const intervalId = setInterval(() => {
          currentPercent += 1;
          setPercent((prev) => (prev < 100 ? prev + 1 : 100));
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
        }, intervalTime);
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
  }
};
