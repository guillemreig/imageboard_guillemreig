console.log("app.js linked!");

import * as Vue from "./vue.js";
import selectPhoto from "./component.js"; // Components

// BODY
Vue.createApp({
    data() {
        return {
            images: [[], [], []],
            imageIndex: 3,
            newImage: {
                username: "",
                title: "",
                description: "",
                file: undefined,
            },
            selectedPhoto: null,
        };
    },
    components: {
        "select-photo": selectPhoto,
    },
    methods: {
        setFile(e) {
            this.newImage.file = e.target.files[0];
        },
        upload() {
            const formData = new FormData();

            const { file, title, description, username } = this.newImage;

            formData.append("file", file);
            formData.append("username", username);
            formData.append("title", title);
            formData.append("description", description);

            fetch("/image", {
                method: "POST",
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((image) => {
                    if (image.url) {
                        this.images[this.imageIndex % 3].unshift(image);
                        this.imageIndex++;
                        // this.images.unshift(image);
                    }
                });
        },
        selectImage(id) {
            console.log("id :", id);
            this.selectedPhoto = id;
        },
        deselectImage() {
            this.selectedPhoto = null;
        },
    },
    mounted() {
        fetch("/images")
            .then((res) => {
                return res.json();
            })
            .then((images) => {
                console.log("images :", images);
                for (let image of images) {
                    console.log("this.imageIndex :", this.imageIndex);
                    this.images[this.imageIndex % 3].unshift(image);
                    this.imageIndex++;
                }
                // this.images = images;
            });
    },
}).mount("main");
