import React, { useState, useEffect } from 'react'
import Card from '../component/Card'
import useFetch from 'use-http'

const ENDPOINT = process.env.ENDPOINT
const PORT = process.env.PORT

const Index = () => {
    const [news, setNews] = useState(null)
    const { get } = useFetch(`${ENDPOINT}:${PORT}`, { cachePolicy: "no-cache", })

    const newsList = async () => {
        try {
            const resNews = await get('/news/listname')
            setNews(resNews)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        newsList()
        document.title = "Psu Phuket Dormitory"
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center">
            {/* <img src="background/index.jpg" alt="index image"/> */}
            <h1 className="text-4xl p-5">จองห้องพัก</h1>
            <p className="text-xl">ระบบนี้สร้างขึ้นมาเพื่อลดปัญหาการจองห้องพักที่ต้องใช้เอกสาร</p>
            <p className="text-xl">เหลือเพียงแค่การเลือกห้องไม่กี่ขั้นตอนเท่านั้น</p>
            <div className="repair flex flex-row flex-wrap p-10">
                <Card>
                    <img className="h-10 w-10 mb-3 self-center" src="icon/booking.svg" alt="book" />
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>จองได้ทันที</p></div>
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>เลือกห้องว่าง</p></div>
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>เลือกตำแหน่งห้อง</p></div>
                </Card>
                <Card>
                    <img className="h-10 w-10 mb-3 self-center" src="icon/settings.svg" alt="repair" />
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>แจ้งซ่อมผ่านระบบ</p></div>
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>แจ้งผลผ่าน Line</p></div>
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>แจ้งได้ตลอดเวลา</p></div>
                </Card>
                <Card>
                    <img className="h-10 w-10 mb-3 self-center" src="icon/mobile-payment.svg" alt="repair" />
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>จ่ายเงินด้วย Qr Code</p></div>
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>หรือช่องทางอื่น ๆ</p></div>
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>แจ้งชำระผ่านระบบ</p></div>
                    <div className="flex flex-row"><img className="w-5 h-5" src="icon/check.svg" alt="check" /><p>แจ้งผลผ่าน Line</p></div>
                </Card>
            </div>

            <h1 className="text-3xl text-center">ข่าวสาร</h1>
            <div className="flex flex-row flex-wrap px-8 justify-center">
                {news !== null ? news.data.map((item, key) => (
                    // const name = `http://localhost/news/${item.newsName}`
                    // const getUrl = async () => await get(`/news/${item.newsName}`)
                    <div className="p-4" key={key}>
                        <h1 className="text-center">{`${item.newsName}`}</h1>
                        <embed src={`http://localhost/news/${item.newsName}`} type="application/pdf" />
                        <div className="flex flex-row justify-center">
                            <a className="m-1 text-blue-400" target="_blank" href={`http://localhost/news/${item.newsName}`}>อ่านเพิ่มเติม</a>
                            <a className="m-1 text-blue-400" href={`http://localhost/news/${item.newsName}?download=true`}>ดาวน์โหลดไฟล์</a>
                        </div>
                    </div>
                )) : ""}
            </div>
        </div>

    )
}

export default Index