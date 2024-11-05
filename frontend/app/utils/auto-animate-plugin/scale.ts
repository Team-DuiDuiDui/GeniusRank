import { AutoAnimationPlugin, getTransitionSizes } from '@formkit/auto-animate';

const scaleAnimate: AutoAnimationPlugin = (el, action, oldCoords, newCoords) => {
    let keyframes;
    if (action === 'add') {
        keyframes = [
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 },
        ];
    }
    if (action === 'remove') {
        keyframes = [
            { transform: 'scale(1)', opacity: 1 },
            { transform: 'scale(0.5)', opacity: 0 },
        ];
    }
    if (action === 'remain') {
        const deltaX = oldCoords!.left - newCoords!.left;
        const deltaY = oldCoords!.top - newCoords!.top;
        const [widthFrom, widthTo, heightFrom, heightTo] = getTransitionSizes(el, oldCoords!, newCoords!);
        const start = { transform: `translate(${deltaX}px, ${deltaY}px)`, width: ``, height: `` };
        const mid = {
            transform: `translate(${deltaX * -0.15}px, ${deltaY * -0.15}px)`,
            offset: 0.75,
            width: ``,
            height: ``,
        };
        const end = { transform: `translate(0, 0)`, width: ``, height: `` };
        if (widthFrom !== widthTo) {
            start.width = `${widthFrom}px`;
            mid.width = `${widthFrom >= widthTo ? widthTo / 1 : widthTo * 1}px`;
            end.width = `${widthTo}px`;
        }
        if (heightFrom !== heightTo) {
            start.height = `${heightFrom}px`;
            mid.height = `${heightFrom >= heightTo ? heightTo / 1 : heightTo * 1}px`;
            end.height = `${heightTo}px`;
        }
        keyframes = [start, mid, end];
    }
    return new KeyframeEffect(el, keyframes!, { duration: 600, easing: 'ease-out' });
};

export default scaleAnimate;
