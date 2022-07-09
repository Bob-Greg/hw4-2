import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {Camera, CameraType} from "react-camera-pro";
import {TextBox} from "./text-box";

let px = 0, py = 0, x = 0, y = 0
let down = false
let color = "black"
let lineWidth = 1
let mode = 'pen'

function App() {
    const camera = useRef<CameraType>(null)
    const canvas = useRef<HTMLCanvasElement>(null)
    const [image, setImage] = useState<string | null>(null)
    const [width, setWidth] = useState<number>(window.innerWidth)
    const [height, setHeight] = useState<number>(window.innerHeight)
    const [updater, setUpdater] = useState<number>(0)

    window.onresize = () => {
        setWidth(window.innerWidth)
        setHeight(window.innerHeight - 50)
        return
    }

    useEffect(() => {
        if (image !== null) {
            const canvas_ = canvas.current!
            const ctx = canvas_.getContext('2d')!
            const image_ = new Image();
            image_.onload = function() {
                ctx.save()
                ctx.scale(-1, 1)
                ctx.drawImage(image_, 0, 0, canvas_.width*-1, canvas_.height)
                ctx.restore()
            }
            image_.src = image!
            canvas_.addEventListener('mousemove', function(ev) {
                switch (mode) {
                    case 'pen':
                        px = x;
                        py = y;
                        x = ev.clientX - canvas_.offsetLeft;
                        y = ev.clientY - canvas_.offsetTop;
                        if (down) {
                            ctx.beginPath()
                            let diffx = x - px
                            let diffy = y - py
                            let len = 1 / Math.hypot(diffx, diffy)
                            diffx *= len
                            diffy *= len
                            ctx.moveTo(px - diffx, py - diffy)
                            ctx.lineTo(x + diffx, y + diffy)
                            ctx.strokeStyle = color
                            ctx.lineWidth = lineWidth
                            ctx.stroke()
                            ctx.closePath()
                        }
                        break;
                }
            })
            canvas_.addEventListener('mousedown', function(ev) {
                down = true
                switch (mode) {
                    case 'dot':
                        if (down) {
                            x = ev.clientX - canvas_.offsetLeft;
                            y = ev.clientY - canvas_.offsetTop;
                            ctx.beginPath()
                            ctx.arc(x, y, lineWidth, 0, 2 * Math.PI)
                            ctx.fillStyle = color
                            ctx.fill()
                            ctx.closePath()
                        }
                        break;
                }
            })
            canvas_.addEventListener('mouseup', function(ev) {
                down = false
            })
            canvas_.addEventListener('mouseout', function(ev) {
                down = false
            })
        }
    }, [image])

    return (
        <div className="overflow-clip">
            { image !== null &&
                <canvas ref={canvas} width={width} height={height - 50}></canvas>
            }
            { image === null &&
                <div className={"setup-camera-dims"}>
                    <Camera ref={camera} aspectRatio={width / (height - 50)} errorMessages={{}}/>
                </div>
            }
            <div className={"flex flex-row"}>
                <button onClick={() => {
                    if (image === null) {
                        const photo = camera.current!!.takePhoto()
                        setImage(photo)
                    } else {
                        setImage(null)
                    }
                }} className={"z-10 bg-gray-200 pl-1 pr-1"}>{image === null ? "Take photo" : "Take another photo"}</button>
                <div className={"pl-3"}/>
                <select value={mode} onChange={ev => {mode = ev.target.value; setUpdater(updater + 1)}} id={updater.toString(10)}>
                    <option value={'pen'}>pen</option>
                    <option value={'dot'}>dot</option>
                </select>
                <div className={"pl-3"}/>
                <select value={color} onChange={ev => {color = ev.target.value; setUpdater(updater + 1)}} id={updater.toString(10)}>
                    <option value="white">white</option>
                    <option value="silver">silver</option>
                    <option value="gray">gray</option>
                    <option value="black">black</option>
                    <option value="red">red</option>
                    <option value="maroon">maroon</option>
                    <option value="yellow">yellow</option>
                    <option value="olive">olive</option>
                    <option value="lime">lime</option>
                    <option value="green">green</option>
                    <option value="aqua">aqua</option>
                    <option value="teal">teal</option>
                    <option value="blue">blue</option>
                    <option value="navy">navy</option>
                    <option value="fuchsia">fuchsia</option>
                    <option value="purple">purple</option>
                </select>
                <div className={"pl-3"}/>
                <TextBox defaultText={"1"} type={"number"} onChange={str => {
                    const i = parseInt(str)
                    if (!isNaN(i)) {
                        lineWidth = i
                    }
                }} customCss={"bg-gray-200"}/>
            </div>
        </div>
    );
}

export default App;