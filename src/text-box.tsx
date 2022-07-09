import {ChangeEvent, useState} from "react";

export type TextBoxProps = {
    defaultText:string
    customCss:string
    onChange:(_:string) => void
    type: 'number' | 'text'
}

export const TextBox = (props:TextBoxProps) => {

    const [text, setText] = useState(props.defaultText)

    function change(ev:ChangeEvent<HTMLInputElement>) {
        setText(ev.target.value)
        props.onChange(ev.target.value)
    }

    return (
        <div>
            <input
                type={props.type}
                value={text}
                onChange={change}
                onFocus={event => event.currentTarget.select()}
                className={`${props.customCss}`}
            />
        </div>
    )
}