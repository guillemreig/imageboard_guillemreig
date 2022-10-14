console.log("app.js linked!");

import * as Vue from "./vue.js";
import selectPhoto from "./component.js";

Vue.createApp({
    data() {
        return {
            heading: "Heading app.js",
            images: [],
            newImage: {
                username: "",
                title: "",
                description: "",
                file: undefined,
            },
            component: [
                {
                    id: 1,
                    title: "Photo",
                },
            ],
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
                .then((data) => {
                    if (data.url) {
                        this.images.unshift(data);
                    }
                });
        },
        selectImage(id) {
            console.log("id :", id);
            this.selectedPhoto = true;
        },
        deselectImage() {
            this.selectedPhoto = null;
        },
    },
    mounted() {
        fetch("/images")
            .then((data) => {
                return data.json();
            })
            .then((images) => {
                this.images = images;
            });
    },
}).mount("main");
