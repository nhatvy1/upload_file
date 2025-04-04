
import { sleep } from "@/utils/sleep";

const worker = self as unknown as Worker;

worker.onmessage = async function (e) {
  try {
    for (let i = 1; i <= 100; i++) {
      await sleep(1000);
      self.postMessage({
        status: 'progress',
        data: i
      })
    }

    worker.postMessage({
      status: 'success',
      data: "Thành công"
    });
  } catch (error: any) {
    worker.postMessage({
      status: 'error',
      error: "Vui lòng thử lại sau"
    });
  }
};

export default worker;