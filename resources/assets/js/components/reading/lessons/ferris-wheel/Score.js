import React from "react";

const getData = (u) => u;

const star = (index, points) => {
    const indexScore = points.max / 5 * index;
    if (points.score >= indexScore) {
        return "/raw/img/ui/star_03.png"
    } else if (points.score > indexScore - points.max / 5) {
        return "/raw/img/ui/star_02.png"
    } else {
        return "/raw/img/ui/star_01.png"
    }
};

const Stars = (props) => {
    const points = props.points;
    return <div style={{position: "relative"}}>
        <img src={getData(star(1, points))} style={{position: "absolute"}}/>
        <img src={getData(star(2, points))} style={{position: "absolute", left: "80px"}}/>
        <img src={getData(star(3, points))} style={{position: "absolute", left: "160px"}}/>
        <img src={getData(star(4, points))} style={{position: "absolute", left: "240px"}}/>
        <img src={getData(star(5, points))} style={{position: "absolute", left: "320px"}}/>
    </div>
};
export const Score = (props) => {
    const points = props.points;

    return <div className={"full-height wc-background"}>
        <div className={"container h-100 d-flex align-items-end justify-content-center"}>
            <div>
                <div style={{position: "relative", backgroundImage: "url(" + getData('/raw/img/ui/form.png') + ")", width: "640px", height: "846px"}}>
                    <img src={getData("/raw/img/ui/clear.png")} style={{position: "absolute", top: "80px", left: "190px"}}/>
                    <div style={{position: "absolute", top: "200px", left: "115px"}}>
                        <Stars points={props.points}/>
                    </div>
                    <div style={{position: "absolute", top: "300px", left: "245px"}}>
                        <p style={{fontFamily: "Luckiest Guy", fontSize: "72px", textShadow: "#4a4a4a 0.05em 0.05em 0.05em", color: "white"}}>{points.score}/{points.max}</p>
                    </div>
                    <img src={getData("/raw/img/ui/reload_button_01.png")} style={{position: "absolute", top: "690px", left: "30px"}}
                        onClick={props.onReload}/>
                    <img src={getData("/raw/img/ui/vera.png")} style={{position: "absolute", top: "410px", left: "203px"}}/>
                    <img src={getData("/raw/img/ui/next_button_01.png")} style={{position: "absolute", top: "690px", left: "150px"}}
                         onClick={props.onNext} />
                </div>
            </div>
        </div>
    </div>
};
