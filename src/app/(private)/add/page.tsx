import AddFriendForm from '@/components/add-friend-form'

export default function Page() {
  return (
    <main className="h-full rounded-md border bg-white p-8 md:ml-4">
      <h1 className="mb-8 text-xl font-bold">Add a Friend</h1>

      <AddFriendForm />
    </main>
  )
}
