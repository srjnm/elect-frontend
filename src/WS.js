import { useEffect } from "react"

const WS = () => {
    useEffect(() => {
        var con = new WebSocket("ws://e1ect.herokuapp.com/api/ws/election")
        con.addEventListener("message", function(e){ console.log(e) })

        window.addEventListener("unload", function () {
            con.onclose = function () {
                if(con.readyState === WebSocket.OPEN)
                    con.close()
            }
        })
    }, [])

    return (
        <div>
            yes
        </div>
    );
}
 
export default WS;