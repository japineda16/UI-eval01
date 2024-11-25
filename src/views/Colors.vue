<template>
    <div class="container mt-5 mb-5">
        <h1 class="mb-4">Selecciona los colores</h1>
        <form @submit.prevent="applyColors">
            <div class="form-group mb-3">
                <label for="titleColor">Color de Títulos:</label>
                <input type="color" id="titleColor" v-model="colors.titleColor" class="form-control">
            </div>
            <div class="form-group mb-3">
                <label for="paragraphColor">Color de Párrafos:</label>
                <input type="color" id="paragraphColor" v-model="colors.paragraphColor" class="form-control">
            </div>
            <div class="form-group mb-3">
                <label for="linksColors">Color de los enlaces:</label>
                <input type="color" id="linksColors" v-model="colors.linksColors" class="form-control">
            </div>
            <div class="form-group mb-3">
                <label for="backgroundColor">Color de Fondo:</label>
                <input type="color" id="backgroundColor" v-model="colors.backgroundColor" class="form-control">
            </div>
            <div class="form-group mb-3">
                <label for="navbarColor">Color de Barra de Navegación:</label>
                <input type="color" id="navbarColor" v-model="colors.navbarColor" class="form-control">
            </div>
            <div class="form-group mb-3">
                <label for="footerColor">Color de Footer:</label>
                <input type="color" id="footerColor" v-model="colors.footerColor" class="form-control">
            </div>
            <div class="row">
                <div class="col-sm form-group mb-3">
                    <label for="fontFile">Cargar fuente del titulo:</label>
                    <input type="file" accept=".ttf" name="fontFile" id="fontFile" @change="handleFontFile"
                        class="form-control">
                </div>
                <div class="col-sm form-group mb-3">
                    <label for="fontFileParagraph">Cargar fuente del parrafo:</label>
                    <input type="file" accept=".ttf" name="fontFileParagraph" id="fontFileParagraph"
                        @change="handleParagraphFontFile" class="form-control">
                </div>
                <div class="col-sm form-group mb-3">
                    <label for="fontSize">Actualizar tamaño de fuente:</label>
                    <input type="number" name="fontSize" id="fontSize" v-model="fontSize" @change="e => console.log(e)"
                        class="form-control">
                </div>
            </div>
            <button type="submit" class="btn btn-primary">Aplicar Colores</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            colors: {
                titleColor: '#000000',
                paragraphColor: '#000000',
                backgroundColor: '#ffffff',
                navbarColor: '#f8f9fa',
                footerColor: '#f8f9fa',
                linksColors: '#000000',
                fontFile: undefined,
            },
            fontSize: undefined
        };
    },
    watch: {
        fontSize: {
            handler: (val, oldVal) => {
                if (val && val > 0) {
                    let p = val;
                    let title = val * 1.618;
                    console.log(title)
                    document.documentElement.style.setProperty('--fontSize-p', `${p}px`);
                    document.documentElement.style.setProperty('--fontSize-t', `${title}px`);
                }
            }
        }
    },
    methods: {
        applyColors() {
            console.log(this.colors);
            document.documentElement.style.setProperty('--title-color', this.colors.titleColor);
            document.documentElement.style.setProperty('--paragraph-color', this.colors.paragraphColor);
            document.documentElement.style.setProperty('--background-color', this.colors.backgroundColor);
            document.documentElement.style.setProperty('--navbar-color', this.colors.navbarColor);
            document.documentElement.style.setProperty('--footer-color', this.colors.footerColor);
            document.documentElement.style.setProperty('--links-color', this.colors.linksColors);
            if (this.fontFile) {
                console.log(this.fontFile)
            }
        },
        handleFontFile(event) {
            const file = event.target.files[0];
            if (file && file.type === "font/ttf") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fontFace = new FontFace('customFont', e.target.result);
                    fontFace.load().then((loadedFontFace) => {
                        document.fonts.add(loadedFontFace);
                        document.documentElement.style.setProperty('--title-font', 'customFont');
                    }).catch((error) => {
                        console.error('Font loading failed:', error);
                        document.documentElement.style.setProperty('--title-font', 'Arial');
                    });
                };
                reader.readAsArrayBuffer(file);
            } else {
                document.documentElement.style.setProperty('--title-font', 'Arial');
            }
        },
        handleParagraphFontFile(event) {
            const file = event.target.files[0];
            if (file && file.type === "font/ttf") {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fontFace = new FontFace('customFont', e.target.result);
                    fontFace.load().then((loadedFontFace) => {
                        document.fonts.add(loadedFontFace);
                        document.documentElement.style.setProperty('--paragraph-font', 'customFont');
                    }).catch((error) => {
                        console.error('Font loading failed:', error);
                        document.documentElement.style.setProperty('--paragraph-font', 'Arial');
                    });
                };
                reader.readAsArrayBuffer(file);
            } else {
                document.documentElement.style.setProperty('--paragraph-font', 'Arial');
            }
        },
        handleFontSize(size) {
            console.log(size.target);
        },
    }
};
</script>

<style>
:root {
    --title-color: #000000;
    --paragraph-color: #000000;
    --links-color: #000000;
    --background-color: #ffffff;
    --navbar-color: #f8f9fa;
    --footer-color: #f8f9fa;
    --title-font: Arial;
    --paragraph-font: Arial;
    --fontSize-p: 16px;
    --fontSize-t: 40px;

}

body {
    background-color: var(--background-color) !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    color: var(--title-color) !important;
    font-family: var(--title-font);
    font-size: var(--fontSize-t) !important;
}

p,
span,
label {
    color: var(--paragraph-color) !important;
    font-size: var(--fontSize-p) !important;
    font-family: var(--paragraph-font);
}

a {
    color: var(--links-color) !important;
    font-family: var(--fontSize-p);
}

#nav-color {
    background-color: var(--navbar-color) !important;
}

#footer-color {
    background-color: var(--footer-color) !important;
}
</style>