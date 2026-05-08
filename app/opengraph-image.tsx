import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Izeva — Catálogo online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #fbfaf7 0%, #f1ede7 100%)',
                color: '#2d2a26',
                fontFamily: 'system-ui, sans-serif',
            }}
        >
            <div style={{ fontSize: 144, fontWeight: 800, letterSpacing: '-0.05em' }}>Izeva</div>
            <div style={{ fontSize: 36, marginTop: 16, color: '#6b6660' }}>
                Carteras · Bolsas · Joyería · Cosméticos
            </div>
        </div>,
        size,
    );
}
