import SiteHeader from "../components/SiteHeader";

export default function NotFoundPage() {
  return (
    <div>
      <SiteHeader />
      <div className='page'>
        <h1 className='m-3'>404: Page Not Found</h1>
      </div>
    </div>
  );
}
