// Una hamburguesa dibujada, triste: el pan de arriba caído hacia un costado, la cara triste y una lágrima que cae.
// La usa la página de error. Es un dibujo SVG: formas (rect, path, circle) con su color y un borde oscuro.
// aria-hidden: es solo un dibujo; el error ya está escrito debajo.
function HamburguesaTriste() {
    return (
        <svg className="hamburguesa-triste" viewBox="0 0 240 230" aria-hidden="true">
            {/* La sombra en el piso. */}
            <ellipse cx="120" cy="214" rx="86" ry="9" fill="#1f1a17" opacity="0.12" />

            {/* El pan de abajo. */}
            <rect x="40" y="172" width="160" height="34" rx="16" fill="#e9a24a" stroke="#1f1a17" strokeWidth="5" />

            {/* La carne. */}
            <rect x="32" y="146" width="176" height="32" rx="15" fill="#6b3a22" stroke="#1f1a17" strokeWidth="5" />

            {/* El cheddar, con dos gotas que chorrean sobre la carne. */}
            <path
                d="M 34 144 L 206 144 L 206 157 L 168 157 Q 161 180 154 157 L 86 157 Q 80 171 74 157 L 34 157 Z"
                fill="#ffc93c" stroke="#1f1a17" strokeWidth="5" strokeLinejoin="round"
            />

            {/* La lechuga: una tira ondulada. */}
            <path
                d="M 28 140 Q 40 124 52 138 Q 64 124 76 138 Q 88 124 100 138 Q 112 124 124 138 Q 136 124 148 138 Q 160 124 172 138 Q 184 124 196 138 Q 206 126 214 140 L 210 148 L 30 148 Z"
                fill="#7cc142" stroke="#1f1a17" strokeWidth="5" strokeLinejoin="round"
            />

            {/* El pan de arriba, con la cara. rotate lo inclina un poco, como si estuviera desanimado. */}
            <g transform="rotate(-7 120 136)">
                <path d="M 34 136 Q 34 56 120 56 Q 206 56 206 136 Z" fill="#f2ad52" stroke="#1f1a17" strokeWidth="5" strokeLinejoin="round" />

                {/* Las semillas de sésamo. */}
                <g fill="#fff3d6">
                    <ellipse cx="88" cy="76" rx="5" ry="3" transform="rotate(-20 88 76)" />
                    <ellipse cx="120" cy="68" rx="5" ry="3" />
                    <ellipse cx="152" cy="76" rx="5" ry="3" transform="rotate(20 152 76)" />
                    <ellipse cx="70" cy="96" rx="5" ry="3" transform="rotate(-35 70 96)" />
                    <ellipse cx="170" cy="96" rx="5" ry="3" transform="rotate(35 170 96)" />
                </g>

                {/* La cara: las cejas levantadas en el medio y la boca curvada para abajo. */}
                <g stroke="#1f1a17" strokeWidth="5" strokeLinecap="round" fill="none">
                    <path d="M 84 100 L 104 92" />
                    <path d="M 136 92 L 156 100" />
                    <path d="M 102 126 Q 120 112 138 126" />
                </g>
                <circle cx="96" cy="110" r="6" fill="#1f1a17" />
                <circle cx="144" cy="110" r="6" fill="#1f1a17" />

                {/* La lágrima, que cae del ojo derecho (la animación está en index.css). */}
                <path className="lagrima" d="M 150 116 Q 144 126 150 131 Q 156 126 150 116 Z" fill="#5bc0eb" stroke="#1f1a17" strokeWidth="2.5" />
            </g>
        </svg>
    );
}

export default HamburguesaTriste;
