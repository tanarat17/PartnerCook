// src/api/lineNotifyService.ts
import axios from 'axios';

const LINE_NOTIFY_URL = 'https://notify-api.line.me/api/notify';
const LINE_NOTIFY_TOKEN = 'CiGFbp5aj2aSjNzgI6VMc5xGUjQnHSBejiuMzHpoZQW'; // ใส่ token ที่นี่

export const notifyProductAddition = async (message: string) => {
    try {
        const formData = new URLSearchParams();
        formData.append('message', message);

        console.log('Sending message to Line Notify:', message); // เพิ่ม log นี้

        // const response = await fetch(LINE_NOTIFY_URL, {
        //     method: 'POST',
        //     headers: {
               
        //         'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //         'Access-Control-Allow-Origin': '*'

        //     },
        //     body: formData.toString(),
        // });

        axios({
            method: 'post',
            url: LINE_NOTIFY_URL,
            headers: {
                'Authorization': `Bearer ${LINE_NOTIFY_TOKEN}`,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Allow-Origin': '*', // เพิ่มเข้าไปใน headers
            },
            data: `message=${encodeURIComponent(message)}` // สร้าง body โดยตรง
        })
        .then(function(res) {
            console.log(res.data);
        })
        .catch(function(err) {
            console.error(err);
        });

        // if (!response.ok) {
        //     const errorData = await response.json();
        //     console.error('Failed to send Line Notify:', errorData);
        // } else {
        //     console.log('Line Notify sent successfully.');
        // }
    } catch (error) {
        console.error('Error sending Line Notify:', error);
    }
};


// แจ้งเตือนกรณีทำการ Add Product -> รออนุมัติ
export const sendNotificationAfterAddPDT = async (p0: string) => {
    try {
      const response = await axios.post('/api', {
        // ข้อมูลที่คุณต้องการส่ง
        message: 'ส่งสินค้าเพื่อรอการอนุมัติ',
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer CiGFbp5aj2aSjNzgI6VMc5xGUjQnHSBejiuMzHpoZQW`,
        },
      });
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
//   sendNotification();

// แจ้งเตือนกรณี Product -> อนุมัติ
export const sendNotification = async (p0: string) => {
    try {
      const response = await axios.post('/api', {
        // ข้อมูลที่คุณต้องการส่ง
        message: 'สินค้าที่คุณเพิ่มถูกอนุมัติ',
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer CiGFbp5aj2aSjNzgI6VMc5xGUjQnHSBejiuMzHpoZQW`,
        },
      });
      console.log('Success:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

