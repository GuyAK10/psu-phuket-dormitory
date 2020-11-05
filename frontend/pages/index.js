import React from 'react'
import Card from '../component/Card'

const Index = () => {
    const news = [
        {
            title: "test",
            img: "https://www.uih.co.th/files/2020/Knowledge/Fake-news/fake-news_9.jpg",
            description: "longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong"
        },
    ]

    return (
        <div className="index-container">
            {/* <img className="index-background" src='background/cover.jpg' alt="cover" /> */}
            <h1>ระบบจองหอพักนักศึกษา</h1>
            <img src="http://61.19.181.27/student/profile/test" alt="ss" />
            <div className="Card-container">
                {/* {news.map((item, key) =>
                    <Card key={key} item={item} />
                )} */}
            </div>
            <style jsx>{`
                    .Card-container{
                        flex:1;
                        justify-content: center;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                    }
            `}</style>
        </div>
    )
}

export default Index