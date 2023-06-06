import io from "socket.io-client";
import { SetStateAction, useEffect, useState } from "react";

import { useRouter } from "next/router";

import YouTube from "react-youtube";
import { Socket } from "net";

export default function Main() {
    const router = useRouter();
    const [ytid, setYtid] = useState("");
    const [ytidInput, setYtidInput] = useState("");

    const [socket, _] = useState(() => io("https://socket-io-togetube.onrender.com"))

    const { id } = router.query;

    let target: any;

    useEffect(() => {
        if (id == null) return;
        socket.emit("join", id);

    }, [id])

    const opts = {
        width: "560",
        height: "315",
        host: "https://www.youtube-nocookie.com"
    };

    socket.on("selectid", (id) => {
        setYtid(id);
    })

    const EmitYtId = (emitytid: any) => {
        socket.emit("emitid", { room: id, value: emitytid })
        setYtid(emitytid);
    }
    const _onReady = (event: { target: any }) => {
        target = event.target;
        checkSocketCont(event.target, event.target.g);
    }
    const checkSocketCont = (yt: any, targetG: any) => {
        const youtube = yt;
        socket.on("join", (msg: {
            seek(seek: any): unknown; id: SetStateAction<string>;
        } | null) => {
            youtube.g = targetG;
            if (msg !== null) {
                setYtid(msg.id);
                youtube.seekTo(msg.seek)
            }
        })
        socket.on("play", (msg) => {
            youtube.g = targetG;
            youtube.playVideo()
            const playertime = youtube.getCurrentTime()
            if (Math.abs(playertime - msg.seek) > 1) {
                youtube.seekTo(msg.seek)
            }
        })
        socket.on("pause", (msg) => {
            youtube.g = targetG;
            youtube.pauseVideo()
            const playertime = youtube.getCurrentTime()
            if (Math.abs(playertime - msg.seek) > 1) {
                youtube.seekTo(msg.seek)
            }
        })
    }
    const _onStateChange = (event: any) => {
        switch (event.data) {
            case 2:
                socket.emit("pause", { room: id, seek: event.target.getCurrentTime() })
                break;

            case 1:
                socket.emit("play", { room: id, seek: event.target.getCurrentTime() })
                break;
        }
    }
    //socket系以外　↓
    const [searchQ, setserachQ] = useState("")
    const [result, setResult]: any = useState();
    const getSearch = async () => {
        const res = await (await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQ}&key=AIzaSyC1KMsyjrnEfHJ3xnQtPX0DSxWHfyjUBeo&maxResults=50&type=video`)).json();
        setResult(res.items)
    }
    return <>
        <div className='flex place-content-center md:mt-4'>
            <div className='wrap'>
                <div className='video-container'>
                    <div className='video flex place-content-center rounded-lg'>
                        <YouTube videoId={ytid}
                            opts={opts}
                            onReady={_onReady}
                            onStateChange={_onStateChange}
                        />
                    </div>
                </div>
            </div>
        </div>
        <div className="flex place-content-center my-4 gap-x-8">
            <div>
                <h1 className="text-lg">YoutubeIDから再生</h1>
                <input type="text" placeholder="YoutubeID" className="mr-4 p-2 rounded-md border-2 outline-0" onChange={(e: any) => { setYtidInput(e.target.value) }} />
                <button className="p-2 rounded-lg bg-gray-800 text-white" onClick={() => { EmitYtId(ytidInput); }}>YoutubeIDで再生</button>
            </div>
            <div>
                <h1 className="text-lg">検索して再生</h1>
                <input type="text" placeholder="YoutubeID" className="mr-4 p-2 rounded-md border-2 outline-0" onChange={(e: any) => { setserachQ(e.target.value) }} />
                <button className="p-2 rounded-lg bg-gray-800 text-white" onClick={() => { getSearch() }}>検索</button>
            </div>
        </div>
        <div className="m-4">
            {
                result ? result.map((item: any) => {
                    console.log(item)
                    return (<>
                        <hr />
                        <a className='block my-4 flex gap-4' href='#' onClick={() => { EmitYtId(item.id.videoId) }}>
                            <img className='inline' src={item.snippet.thumbnails.high.url} alt="" id="img_" />
                            <div className='inline'>
                                <p>{item.snippet.title} </p>
                                <p>{item.snippet.channelTitle} </p>
                            </div>
                        </a>
                    </>)
                })
                    :
                    <></>
            }
        </div>
    </>
}