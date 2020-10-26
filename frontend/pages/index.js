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
            <img className="index-background" src='background/cover.jpg' alt="cover" />
            <div className="Card-container">
                {news.map((item, key) =>
                    <Card key={key} item={item} />
                )}
            </div>
            <style jsx>{`
                    .Card-container{
                        flex:1;
                        justify-content: center;
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                        /*background: rgb(26, 62, 112);
                        background: linear-gradient(180deg, rgba(26, 62, 112, 1) 0%, rgba(22, 119, 125, 1) 120%);*/
                    }
            `}</style>
        </div>
    )
}

// Index.getInitialProps = async (ctx) => {

//     return { result: "Test" }
// }
export default Index