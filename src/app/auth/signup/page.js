"use client"
import { 
  VStack,
  Button,
  useColorMode,
  Spacer,
  HStack,
  Text,
  Link,
  IconButton,
  InputGroup,
  InputRightElement,
  Skeleton,
  SkeletonText,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { FaMoon } from "@react-icons/all-files/fa/FaMoon";
import { HiSun } from "@react-icons/all-files/hi/HiSun";
import { useState, useEffect, useContext } from "react"; 
import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaEyeSlash } from "@react-icons/all-files/fa/FaEyeSlash";
import {
  Touchable,
  isEmailValid,
  isFullNameValid,
  isUsernameValid,
  isPasswordValid,
  isBirthDateValid
} from "../components/index";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/app/providers/AuthProvider";
import { 
  Input,
  Image,
  DatePicker
} from "@nextui-org/react";
import { isAuthenticated } from "@/app/configs/api";




const Signup = () => {

  const { colorMode, toggleColorMode } = useColorMode();

  const router = useRouter();

  const [username, setUsername] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

  const [fullName, setFullName] = useState(null);
  const [fullNameError, setFullNameError] = useState(null);

  const [email, setEmail] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const [password, setPassword] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const [birthDate, setBirthDate] = useState(null);

  const [birthDateError, setBirthDateError] = useState(null);

  const [show, setShow] = useState(false);

  const [signupError, setSignupError] = useState(null);
  const [auth_loading, setAuthLoading] = useState(false);
  const [formValid, setFormValid] = useState(true);

  const { 
    auth_signup
  } = useContext(AuthContext);


  const toast = useToast();


  const signupUser = async () => {

    setUsernameError(null);
    setFullNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setBirthDateError(null);

    let birthValid = isBirthDateValid(birthDate.toString());

    if(!isUsernameValid(username))
    {
      setUsernameError("Username format is invalid, make sure it's at least 3 characters long and contains one or two: digits (0-9), characters (a-Z), special characters (_)")
      setFormValid(false);
    }
  
    else if(!isFullNameValid(fullName))
    {
      setFullNameError("Full Name format is invalid, make sure to put a space between first and last name.");
      setFullName(null);
      setFormValid(false);
    }

    else if(!isEmailValid(email))
    {
      setEmailError("Email format is invalid.");
      setEmailError(null);
      setFormValid(false);
    }


    else if(!isPasswordValid(password))
    {
      setPasswordError("Password is too weak, make sure it's more than 6 characters long.")
      setPassword(null);
      setFormValid(false);
    }


    else if(birthValid===0)
    {
      setBirthDateError("You need to be at least 18 years old to use voidback.")
      setBirthDate(null);
      setFormValid(false);
    }

    else if(birthValid===2)
    {
      setBirthDateError("You need a valid birth date to use voidback.")
      setBirthDate(null);
      setFormValid(false);
    }


    if(formValid){
      setAuthLoading(true);

      const response = await auth_signup(username, email, password, fullName, birthDate.toString());

      if(response && response.status===201)
      {
        toast({
          title: "Successfully signed up!",
          description: "you can now login to your account!",
          status: "success",
          duration: 5000
        })
        setUsername(null);
        setEmail(null);
        setPassword(null);
        setBirthDate(null);
        setFullName(null);

        return router.replace("/auth/login");
      }
      else{
        if(response)
          setSignupError(await response.json());
        else{
          router.refresh();
        }
      }

      setAuthLoading(false);
    }

  }


  useEffect(()=> {
    if(isAuthenticated()) return router.replace("/home/foryou");
  }, [])


  useEffect(()=> {
    if(signupError)
    {
      if("username" in signupError)
        setUsernameError(signupError.username[0]);

      if("full_name" in signupError)
        setFullNameError(signupError.full_name[0]);

      if("birth_date" in signupError)
        setBirthDateError(signupError.birth_date[0]);

      if("email" in signupError)
        setEmailError(signupError.email[0]);

      if("password" in signupError)
        setFullNameError(signupError.password[0]);

    }
  }, [signupError])

  return (
    <div
      overflow={"hidden"}
      className="bg-background h-[100vh] w-full flex flex-col justify-around p-2"
    >

    <form
      className="w-full flex flex-row justify-center"
    >
      <VStack
        justifySelf={"center"}
        width={"60%"}
        maxW={"500px"}
      >
        <div className="w-[100vw] flex flex-row justify-end px-10 py-5">
          <Spacer/>
          <Text
            fontSize={"xx-large"}
            fontFamily={"sans-serif"}
            fontWeight={600}
            marginLeft={10}
          >
            Voidback.
          </Text>

            <Spacer />
          <Skeleton
            borderRadius={"3px"}
            isLoaded={!auth_loading}
          >
            <IconButton
              onClick={toggleColorMode}
              variant={"unstyled"}
            >
              { colorMode==="light"
                ?
                <FaMoon size={30} />
                :
                <HiSun size={30} color="white" />
              }
            </IconButton>
          </Skeleton>
        </div>


         <Skeleton
          borderRadius={"3px"}
          isLoaded={!auth_loading}
          >
            <Image 
              src="/logo.png"
              width={"200px"}
            />
        </Skeleton>


        <VStack
          width="80%"
          spacing={"20px"}
            className="my-5"
        >
          <div className="w-full flex flex-row gap-4">

           <Skeleton
            borderRadius={"3px"}
            isLoaded={!auth_loading}
            width="100%"
            >
              <Input 
                label="Username"
                autoComplete="username"
                isRequired
                size="md"
                placeholder="username"
                type="text"
                onChange={(e)=>{
                  e.preventDefault();
                  setUsername(e.target.value);
                }}
                errorMessage={usernameError}
                isInvalid={usernameError}
              />
          </Skeleton>

           <Skeleton
              borderRadius={"3px"}
              isLoaded={!auth_loading}
              width="100%"
            >
            <Input 
              isRequired
              label="Full Name"
              size="md"
              placeholder="full name"
              autoComplete="name"
              type="text"
              onChange={(e)=>{
                e.preventDefault();
                setFullName(e.target.value);
              }}
              errorMessage={fullNameError}

              isInvalid={fullNameError}
            />
          </Skeleton>
        </div>

     <Skeleton
          width="100%"
          borderRadius={"3px"}
          isLoaded={!auth_loading}
          >
          <DatePicker 
            isRequired
            label="Birth Date" 
            onChange={(v)=>setBirthDate(v)}
            showMonthAndYearPickers
            errorMessage={birthDateError}
            isInvalid={birthDateError}
            autoComplete="bday"
          />
        </Skeleton>


         <Skeleton
          width="100%"
          borderRadius={"3px"}
          isLoaded={!auth_loading}
          >
          <Input 
            size="md"
            autoComplete="email"
            placeholder="email"
            type="email"
            onChange={(e)=>{
              e.preventDefault();
              setEmail(e.target.value);
            }}
            errorMessage={emailError}
            isInvalid={emailError}
          />
        </Skeleton>



        <InputGroup>
         <Skeleton
          borderRadius={"3px"}
          isLoaded={!auth_loading}
          width="100%"
        >
          <Input 
            size="md"
            fontSize={"large"}
            alignSelf={"center"}
            placeholder="password"
            autoComplete="new-password"
            type={show ?"text" : "password"}
            onChange={(e)=>{
              e.preventDefault();
              setPassword(e.target.value);
            }}
            errorMessage={passwordError}
            isInvalid={passwordError}
          />

          </Skeleton>

          <InputRightElement paddingRight={4}>
            <Touchable type="button" onClick={()=>setShow(!show)}>
              { show ?
              <FaEye size={28} />
                :
                <FaEyeSlash size={28} />
              }
            </Touchable>
          </InputRightElement>
        </InputGroup>



        <Skeleton
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Button
            marginTop={5}
            onClick={signupUser}
            type="button"
            isDisabled={!username || !fullName || !birthDate || !email || !password}
          >
            Signup
          </Button>

        </Skeleton>



       <HStack
        width="100%"
        color={"grey"}
        fontSize={"small"}
      >
        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Text>
            By signing up, you agree to our <Link
            onClick={()=>router.push("/terms")}
            fontWeight="600"
            >Terms of Service</Link>, <Link fontWeight="600" onClick={()=>router.push("/privacyPolicy")}
            >Privacy Policy
            </Link> and <Link fontWeight="600" onClick={()=>router.push("/cookiesPolicy")}>Cookies Policy.</Link>
          </Text>
        </SkeletonText>
      </HStack>


      <HStack>
        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Text
          >
            Already have an account?
          </Text>
        </SkeletonText>


        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Link 
            fontWeight={600}
            color="grey"
            onClick={()=>router.push("/auth/login")}
          >
            Login
          </Link>
        </SkeletonText>
      </HStack>

      </VStack>
    </VStack>
  </form>


  <Spacer />

    <div className="w-full flex flex-row justify-center py-4">
      <HStack
        direction={"row"}
        width="80%"
        maxWidth={"700px"}
        alignSelf="center"
      >

        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >         
          <Link
            color="grey"
            fontSize={"small"}
            fontWeight={500}
            href="/help/au"
          >
            About
          </Link>

        </SkeletonText>

        <Spacer/>

        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Link
            color="grey"
            fontSize={"small"}
            fontWeight={500}
            href="/legal/pp"
          >
            Privacy Policy
          </Link>

        </SkeletonText>

        <Spacer/>

        <SkeletonText
          borderRadius={"3px"}
          isLoaded={!auth_loading}
        >
          <Link
            color="grey"
            fontSize={"small"}
            fontWeight={500}
            href="/legal/tos"
          >
            Terms Of Service
          </Link>

        </SkeletonText>
      </HStack>
    </div>
  </div>
  )
}



export default Signup;
