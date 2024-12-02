import { Text } from '@chakra-ui/react';
import { Image, Link } from '@nextui-org/react';
import { NavBack } from './research/components/topSection';



export default async function NotFound() {
  return (
    <div className='bg-background'>

      <div className='self-start p-10'>
        <NavBack home={true} />
      </div>

      <div
        className='w-full h-[100%] bg-background flex flex-col justify-center py-10'
      >
        <div
          className='w-full flex flex-row justify-center'
        >
          <div className='flex flex-col'>
            <Image src={"/illustrations/404.svg"} className='w-full h-full' />
            <Text
              fontSize={"medium"}
              fontWeight={600}
              fontFamily={"monospace"}
              className='w-full flex flex-row justify-center'
            >
              #404 AKA "this page does not exist."
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

