import React, { useState } from 'react'
import styles from './index.less'

function Player (props) {
  const [play, setPlay] = useState(false)
  const data = props.data[0].data
  return (
    <div>
      {
        play ? <div>
          <video src='http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4' controls autoPlay className={styles.video}>
              your browser does not support the video tag
          </video>
        </div> : <div className={styles.playerContainer} style={{
          background: 'url(' + data.img + ')' + '0  0 /cover'
        }}>
          <div className={styles.title}>{data.title}</div>
          <img className={styles.ico} src='https://gw.alicdn.com/tfs/TB1eA6FEW61gK0jSZFlXXXDKFXa-135-135.png' onClick={() => setPlay(true)} />
          <div className={styles.layer} />
        </div>
      }
    </div>
  )
}

export default Player
