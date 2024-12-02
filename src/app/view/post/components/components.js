import { LeftFeedContext } from "@/app/providers/FeedsProvider/LeftFeedProvider";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";
import { 
  VStack,
  Spacer,
  HStack,
  Stack,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SkeletonText,
  Link,
  CloseButton,
} from "@chakra-ui/react";
import PostOption from "@/app/editor/components/toolbarComponents/PostOption";
import ImageOption from "@/app/editor/components/toolbarComponents/ImageOption";
import VideoOption from "@/app/editor/components/toolbarComponents/VideoOption";
import Editor, { ReadonlyEditor } from "@/app/editor/components/editor";
import CharLimit from "@/app/editor/components/toolbarComponents/charLimit";
import { MediaSection } from "./MediaSection";
import { EditorContext } from "@/app/providers/FeedsProvider/PostEditorProvider";
import { AnalyticsContext } from "@/app/providers/AnalyticsProvider";
import { UserCard } from "@/app/profile/components/components";
import { PostBottomBar, PostTopBar } from "./postbars";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";



export const ParentPostCard = ({post}) => {


  return (
  
    <Card
      width="100%"
      variant={"unstyled"}
      backgroundColor={"default"}
      className="bg-background w-full shadow-none border-0"
    >
      {
        post.parent_post
        &&
        <VStack className="w-full h-full">
          <ParentPostCard post={post.parent_post} />
        </VStack>
      }
      <CardHeader>

        <PostTopBar post={post} />
    </CardHeader>

      <CardBody>
        <MediaSection video={post.video} image={post.image} />

        <div className="w-full px-10">
          <ReadonlyEditor content={post.content} />
        </div>
    </CardBody>


    <CardFooter className="my-5 flex flex-col">
      <PostBottomBar post={post} />
        <Divider orientation="vertical" style={{height: "10vh"}} />
    </CardFooter>

    </Card>
  )
}



export const ReplyEditor = ({parent_post_id}) => {

  const [content, setContent] = useState(null);
  const [attributes, setAttributes] = useState(null);
  const [text, setText] = useState(null);

  const { 
    postError, 
    postLoading, 
    postSuccess,
    lastPostId,
  } = useContext(EditorContext);



  const { account } = useContext(AuthContext);
 
 
  const { modelLoading } = useContext(AnalyticsContext);


  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);


  useEffect(()=> {
    if(postError)
      setErrorOpen(true);
  }, [postError])


  useEffect(()=> {
    if(postSuccess && !modelLoading)
      setSuccessOpen(true);
  },[postSuccess])



  return (
    <VStack
      maxHeight={"100%"}
      minHeight={"100%"}
      padding={"2%"}
      direction="column"
      overflowY={"hidden"}
    >
{
          errorOpen 
            &&
          <Alert 
              alignSelf={"center"}
              status="error" 
              width={"fit-content"}
              borderRadius="3px"
              padding={"2%"}
              height={"fit-content"}
            >
            <AlertIcon boxSize={"5%"} />
            <Spacer/>

            <HStack>
              <AlertTitle fontWeight={"600"}>Post Error:</AlertTitle>

              <AlertDescription>
                {postError}
              </AlertDescription>
            </HStack>

            <Spacer/>

            <CloseButton
              onClick={()=>setErrorOpen(!errorOpen)}
            />

          </Alert>
        }

        {
          successOpen
            &&
            <Alert 
                alignSelf={"center"}
                status="success" 
                width={"fit-content"}
                borderRadius="3px"
                padding={"2%"}
                height={"fit-content"}
              >
              <AlertIcon boxSize={"5%"} />
              <Spacer/>

              <HStack>
                <AlertTitle fontWeight={"600"}>Post:</AlertTitle>

                <AlertDescription>
                  <Link href={`/view/post/${lastPostId}`}>view your post</Link>
                </AlertDescription>
              </HStack>

              <Spacer/>

              <CloseButton
                onClick={()=>setSuccessOpen(!successOpen)}
              />

            </Alert>
        }


        {

          account

          &&

          <HStack width="100%">
            <UserCard
              username={account.username}
              avatarUrl={account.avatar}
              fullName={account.full_name}
            />
          </HStack>

        }


        <Skeleton isLoaded={!postLoading && !modelLoading}>
          { image || video ?
          <MediaSection setVideo={setVideo} video={video} image={image} setImage={setImage} edit_mode />
            : null
          }
        </Skeleton>


        
        <SkeletonText style={{scrollbarWidth: "none"}} isLoaded={!postLoading && !modelLoading}>
          <div className="w-[50vw] max-w-[600px] items-center flex flex-col border-0 rounded-md">
            <Editor setContent={setContent} setAttributes={setAttributes} setText={setText} />

            <div className="w-full flex flex-row p-2 border-1 h-fit rounded-lg">

              <div className="flex flex-row gap-4">
                <ImageOption image={image} setImage={setImage} />
                <VideoOption video={video} setVideo={setVideo} />
                <CharLimit text={text} />
              </div>

              <Spacer/>

              <PostOption video={video} image={image} content={content} attributes={attributes} text={text} is_private={false} parent_post={parent_post_id} />
            </div>

          </div>

        </SkeletonText>
      </VStack>

  )
}



