import { useEffect } from "react";
import HomeBtn from "./components/HomeBtn";
import { initGame } from "./game/game";

/* React renders the fixed RCR-style frame once; the game engine in
   src/game/game.ts then drives each region (chart/room/menu/dialogue)
   imperatively by id, shop-screen style. */
export default function App() {
  useEffect(() => { initGame(); }, []);

  return (
    <div id="frame">
      <HomeBtn />

      {/* top HUD: portrait, bars, yen, item slots, clock */}
      <header id="hud">
        <div id="hud-left">
          <div id="portrait">🧑‍⚕️</div>
          <div id="hud-meta">
            <div className="bar green"><div className="bar-fill"></div></div>
            <div className="bar red"><div className="bar-fill"></div></div>
            <div id="slots"></div>
            <div id="hud-yen">¥0</div>
          </div>
        </div>
        <div id="hud-center">にゃんワン Rx ・ NYANWAN CLINIC</div>
        <div id="hud-right">
          <span id="hud-healed">💖 0</span>
          <div id="clock"><div id="clock-hand"></div></div>
        </div>
      </header>

      {/* middle: chart | room | menu */}
      <div id="mid">
        <aside id="chart" className="panel"></aside>
        <main id="room"></main>
        <aside id="menu" className="panel"></aside>
      </div>

      {/* bottom dialogue bar */}
      <footer id="dialogue">
        <span id="dlg-speaker"></span><span id="dlg-text"></span>
      </footer>

      <div id="modal" className="hidden"><div id="modal-content"></div></div>
    </div>
  );
}
