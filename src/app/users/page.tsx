const SingleUserPage = ({ params }: { params: { username: string } }) => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">User: {params.username}</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        This is a simplified profile page. Feature-rich user dashboard content was removed for stability.
      </p>
      <div className="mt-4">
        <a href="/users" className="inline-block px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
          Back to Users
        </a>
      </div>
    </div>
  );
};

export default SingleUserPage;
