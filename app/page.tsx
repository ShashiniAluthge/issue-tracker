import Image from "next/image";
import Pagination from "./components/Pagination";

interface Props {
  searchParams: Promise<{ page: string }>
}

export default async function Home({ searchParams }: Props) {
  const resolvedParams = await searchParams
  return (
    <Pagination itemCount={100} pageSize={10} currentPage={parseInt(resolvedParams.page)} />
  );
}
