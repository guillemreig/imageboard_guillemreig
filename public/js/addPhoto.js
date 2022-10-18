console.log("addPhoto.js linked!");

const addPhoto = {
    data() {
        return {
            newImage: {
                username: "",
                title: "",
                description: "",
                file: undefined,
            },
        };
    },
    props: ["photo"],
    template: `
        <div id="overlay">
            <form id="form" action="/image" method="post" enctype="multipart/form-data">
                    <input v-model="newImage.username" type="text" name="username" placeholder="Username" required />
                    <input v-model="newImage.title" type="text" name="title" placeholder="Title" required />
                    <input v-model="newImage.description" type="text" name="description" placeholder="Description" required />
                    <input @change="setFile" type="file" name="file" required />
                    <input type="button" value="Upload" @click="upload" />
                </form>
        </div>
    `,
    mounted() {
        console.log("add-photo mounted");
    },
    methods: {
        closePhoto() {
            this.$emit("close-add");
        },
    },
};

export default addPhoto;
