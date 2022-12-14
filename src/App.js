import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import { useEffect, useState } from "react";
import "./App.css";
import { auth, db } from "./firebase";
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyle = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyle();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        //use has logged in...
        console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //don't update username
        } else {
          //if new user
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        //user has logged out
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  //UseEffect- runs a piece of code based on specific condition
  useEffect(() => {
    //this where the code runs
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        //every time the post added, this code fires....
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, [posts]); //every time the posts changes

  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      {/* Caption Input */}
      {/* File picker */}
      {/* Post button */}

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                classes="app_headerImage"
                src="https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png"
                alt=""
              />
            </center>
            {/* <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /> */}
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
      {/* Header */}
      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQiNAPxFUI_tRddTOUmelPpIb__mJLOlXJ4qw&usqp=CAU"
          alt="img"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app_loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              postId={id}
              user={user}
              key={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app_postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/B_uf9dmAGPw/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {/* Posts */}

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}

      {/* Posts */}
      {/* <Post
        username="Hillary Macwan"
        caption="It has been a week since he come to India"
        imageUrl="data:image/jpeg;base64,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"
      />
      <Post
        username="Karan"
        caption="Since i come here we never meet for single minute"
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQWQUzCefU6O505MuPDvnahhq35vGrZnlW1kQ&usqp=CAU"
      /> */}
    </div>
  );
}

export default App;
