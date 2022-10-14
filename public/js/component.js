const selectPhoto = {
    data() {
        return {
            title: "Selected Image",

            photo: null,
        };
    },
    props: ["photo"],
    mounted() {
        if (this.photo) {
            this.photoTitle = findPhotoTitle(this.photo);
        }
    },
    methods: {
        findPhotoTitle(photoId) {
            for (let i = 0; i < this.photos.length; i++) {
                if (this.photos[id].id == photoId) {
                    return this.photos[id];
                }
            }
        },
    },
    template: `
        <div class="component">
            <h3>{{ title }}</h3>
            <p>{{ photo }}</p>
        </div>
    `,
};

export default imageComponent;
