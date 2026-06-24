# Lisboa Motors - TV Indoor

Projeto preparado para GitHub Pages e TV Indoor.

## Estrutura
- `index.html`: estrutura da tela
- `style.css`: visual completo
- `script.js`: motor dos slides
- `dados/veiculos.js`: carros do painel principal
- `dados/ofertas.js`: ofertas da lateral
- `dados/instagram.js`: fotos e vídeos do bloco Instagram

## Pastas de mídia
- `assets/logo/` coloque `logo.jpeg`
- `assets/veiculos/` fotos dos carros principais
- `assets/ofertas/` fotos das ofertas
- `assets/instagram/` fotos `.jpg/.png` e vídeos `.mp4`

## Instagram
No arquivo `dados/instagram.js`, use apenas o nome do arquivo:

```js
window.INSTAGRAM = [
  { tipo:"video", arquivo:"entrega_onix.mp4", titulo:"@lisboamotors" }
];
```

O vídeo deve estar em `assets/instagram/entrega_onix.mp4`.
