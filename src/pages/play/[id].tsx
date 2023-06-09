import io from "socket.io-client";
import { SetStateAction, useEffect, useState } from "react";

import { useRouter } from "next/router";

import YouTube from "react-youtube";
import { Socket } from "net";

export default function Main() {
    const router = useRouter();
    const [ytid, setYtid] = useState("");
    const [ytidInput, setYtidInput] = useState("");
    const [readied, setReadied] = useState(false)

    const iohost: any = process.env.NEXT_PUBLIC_HOST
    const [socket, _] = useState(() => io(iohost))

    const { id } = router.query;

    let target: any;

    useEffect(() => {
        if (!readied) return;
        socket.emit("join", id);

    }, [readied])

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
        event.target.playVideo()
        target = event.target;
        checkSocketCont(event.target, event.target.g);
        setReadied(true);
    }
    const checkSocketCont = (yt: any, targetG: any) => {
        const youtube = yt;
        // socket.on("firstJoin", (msg: {
        //     seek(seek: any): unknown; id: SetStateAction<string>;
        // } | null) => {
        //     console.log("join")
        //     youtube.g = targetG;
        //     if (msg !== null) {
        //         setYtid(msg.id);
        //         youtube.seekTo(msg.seek)
        //     }
        // })
        socket.on("join", (msg) => {
            youtube.g = targetG;
            socket.emit("seek", { room: id, ytid: ytid, seek: youtube.getCurrentTime(), state: youtube.getPlayerState() })
        })
        socket.on("play", (msg) => {
            console.log(msg)
            youtube.g = targetG;
            youtube.playVideo()
            setYtid(msg.ytid)
            const playertime = youtube.getCurrentTime()
            if (Math.abs(playertime - msg.seek) > 1) {
                youtube.seekTo(msg.seek)
            }
        })
        socket.on("pause", (msg) => {
            youtube.g = targetG;
            youtube.pauseVideo()
            setYtid(msg.ytid)
            const playertime = youtube.getCurrentTime()
            if (Math.abs(playertime - msg.seek) > 1) {
                youtube.seekTo(msg.seek)
            }
        })
    }
    const _onStateChange = (event: any) => {
        switch (event.data) {
            case 2:
                socket.emit("pause", { room: id, seek: event.target.getCurrentTime(), ytid: ytid })
                break;

            case 1:
                socket.emit("play", { room: id, seek: event.target.getCurrentTime(), ytid: ytid })
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
        <p className="text-center my-2 text-lg"><span className="border-b-2 border-current">{id}</span></p>
        <p className="text-xs text-center text-gray-500">再生が始まらない場合は、ブラウザの自動再生を許可してください。</p>
        <div className='flex place-content-center'>
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
        <div className="flex flex-wrap place-content-center my-4 gap-x-8">
            <div>
                <h1 className="text-lg">YoutubeIDから再生</h1>
                <input type="text" placeholder="YoutubeID" className="mr-4 p-2 rounded-md border-2 outline-0" onChange={(e: any) => { setYtidInput(e.target.value) }} />
                <p className="my-2"><button className="p-2 rounded-lg bg-gray-800 text-white" onClick={() => { EmitYtId(ytidInput); }}>YoutubeIDで再生</button></p>
            </div>
            <div>
                <h1 className="text-lg">検索して再生</h1>
                <input type="text" placeholder="YoutubeID" className="mr-4 p-2 rounded-md border-2 outline-0" onChange={(e: any) => { setserachQ(e.target.value) }} />
                <p className="my-2"><button className="p-2 rounded-lg bg-gray-800 text-white" onClick={() => { getSearch() }}>検索</button></p>
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